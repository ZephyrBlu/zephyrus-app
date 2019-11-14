import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, Fragment } from 'react';
import { setReplayList, setReplayInfo } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../General/StatCategory';
import DefaultResponse from '../General/DefaultResponse';
import WaveAnimation from '../General/WaveAnimation';
import './CSS/Replays.css';

const selectData = createSelector(
    state => `Token ${state.token}`,
    state => state.apiKey,
    state => state.replayList,
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (token, apiKey, userReplays, replayInfo, selectedReplayHash) => (
        [token, apiKey, userReplays, replayInfo, selectedReplayHash]
    ),
);

const Replays = () => {
    const dispatch = useDispatch();
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const [timelineStat, setTimelineStat] = useState('resource_collection_rate.minerals');
    const [token, apiKey, userReplays, replayInfo, selectedReplayHash] = useSelector(selectData);
    const [cachedTimeline, setCachedTimeline] = useState({ 0: { 1: {} } });
    const [currentGameloop, setCurrentGameloop] = useState(0);
    const [timelineData, setTimelineData] = useState([{
        building: {},
        current_selection: {},
        gameloop: 0,
        resource_collection_rate: { minerals: 0, gas: 0 },
        unit: {},
        unspent_resources: { minerals: 0, gas: 0 },
    }]);

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

    useEffect(() => {
        const getUserReplays = async () => {
            let urlPrefix;
            if (process.env.NODE_ENV === 'development') {
                urlPrefix = 'http://127.0.0.1:8000/';
            } else {
                urlPrefix = 'https://zephyrus.gg/';
            }

            const url = `${urlPrefix}api/all/`;
            let status;

            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then((response) => {
                status = response.status;
                return response.json();
            }).then(responseBody => (
                responseBody
            )).catch(() => null);

            if (status === 200 && data.length > 0) {
                dispatch(setReplayList(data));
            } else {
                dispatch(setReplayList(false));
            }
        };

        if (userReplays && userReplays.length < 1) {
            getUserReplays();
        }
    }, []);

    useEffect(() => {
        const filterReplayInfo = () => {
            const newReplays = [];
            userReplays.forEach((replay) => {
                const currentReplayInfo = {
                    fileHash: replay.file_hash,
                    matchup: `${replay.players[1].race.slice(0, 1)}v${replay.players[2].race.slice(0, 1)}`,
                    map: replay.map,
                    result: `${replay.win ? 'Win' : 'Loss'},\xa0\xa0\xa0\xa0${Math.ceil(replay.match_length / 60)}`,
                    date: replay.played_at.slice(0, 10),
                    player1: `${replay.players[1].name.slice(clanTagIndex(replay.players[1].name))},
                    ${replay.match_data.mmr[1] === 0 ? '' : replay.match_data.mmr[1]}`,
                    player2: `${replay.players[2].name.slice(clanTagIndex(replay.players[2].name))},
                    ${replay.match_data.mmr[2] === 0 ? '' : replay.match_data.mmr[2]}`,
                };
                newReplays.push(currentReplayInfo);
            });
            dispatch(setReplayInfo(newReplays));
        };

        if (userReplays && userReplays.length > 0) {
            filterReplayInfo();
        }
    }, [userReplays]);

    useEffect(() => {
        const getSelectedReplay = () => {
            userReplays.forEach((replay) => {
                if (replay.file_hash === selectedReplayHash) {
                    setSelectedReplay(replay);
                }
            });
        };

        const getReplayTimeline = async () => {
            await setCurrentGameloop(0);

            let url;
            if (process.env.NODE_ENV === 'development') {
                url = `https://www.googleapis.com/storage/v1/b/sc2-timelines-dev/o/${selectedReplayHash}.json.gz?key=${apiKey}`;
            } else {
                url = `https://www.googleapis.com/storage/v1/b/sc2-timelines/o/${selectedReplayHash}.json.gz?key=${apiKey}`;
            }

            const metadata = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'gzip',
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => null);

            url = metadata.mediaLink;
            const data = await fetch(url, {
                method: 'GET',
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => null);

            setTimelineData(data.timeline);

            const timeline = {};
            data.timeline.forEach((gamestate) => {
                timeline[gamestate[1].gameloop] = gamestate;
            });
            setCachedTimeline(timeline);
        };

        if (userReplays && (userReplays.length > 0)) {
            getSelectedReplay();
        }

        if (selectedReplayHash) {
            getReplayTimeline();
        }
    }, [selectedReplayHash]);

    useEffect(() => {
        const filterSelectedReplayInfo = () => {
            const infoList = { user_match_id: selectedReplay.user_match_id };
            Object.entries(selectedReplay.match_data).forEach(([stat, values]) => {
                infoList[stat] = values;
            });
            setSelectedReplayInfo(infoList);
        };
        if (selectedReplay) {
            filterSelectedReplayInfo();
        }
    }, [selectedReplay]);

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const pageTitle = 'Replays';

    const getPlayers = () => ({
        1: {
            name: selectedReplay.players[1].name.slice(clanTagIndex(selectedReplay.players[1].name)),
            race: selectedReplay.players[1].race,
        },
        2: {
            name: selectedReplay.players[2].name.slice(clanTagIndex(selectedReplay.players[2].name)),
            race: selectedReplay.players[2].race,
        },
    });

    const mainContent = (
        <Fragment>
            {selectedReplayInfo &&
                <ReplayInfo
                    selectedReplay={selectedReplay}
                    timelineStat={timelineStat}
                    setTimelineStat={setTimelineStat}
                    clanTagIndex={clanTagIndex}
                />}
            {selectedReplayHash && (timelineData.length > 1 ?
                <TimelineArea
                    timelineData={timelineData}
                    timeline={cachedTimeline}
                    timelineStat={timelineStat}
                    gameloop={currentGameloop}
                    setGameloop={setCurrentGameloop}
                    players={getPlayers()}
                /> : <WaveAnimation />)}
            <div className={`replay-stats${selectedReplayInfo ? '' : '--default'}`}>
                {selectedReplayInfo ?
                    <div className="replay-stats__stats">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                type="replays"
                                category={category}
                                replayInfo={selectedReplayInfo}
                            />
                        ))}
                    </div>
                    :
                    <h2 className="replay-stats__default">Select a replay to view</h2>}
            </div>
        </Fragment>
    );

    let sideBar;

    if (userReplays) {
        sideBar = (
            replayInfo.length > 0 ?
                <ReplayList replayList={replayInfo} apiKey={apiKey} />
                :
                <WaveAnimation />
        );
    } else {
        sideBar = (<DefaultResponse />);
    }

    return (
        <div className="Replays">
            <ProfileSection
                section="Replays"
                pageTitle={pageTitle}
                mainContent={mainContent}
                sideBar={sideBar}
                modifier="replays"
            />
        </div>
    );
};

export default Replays;
