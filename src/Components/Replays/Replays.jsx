import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, Fragment } from 'react';
import { setReplays, setReplayInfo } from '../../actions';
import ReplayList from './ReplayList';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../General/StatCategory';
import DefaultResponse from '../General/DefaultResponse';
import WaveAnimation from '../General/WaveAnimation';
import './CSS/Replays.css';

const selectData = createSelector(
    state => `Token ${state.token}`,
    state => state.selectedRace,
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (token, selectedRace, replayInfo, selectedReplayHash) => (
        [token, selectedRace, replayInfo, selectedReplayHash]
    ),
);

const Replays = (props) => {
    const dispatch = useDispatch();
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const [timelineStat, setTimelineStat] = useState('resource_collection_rate_all');
    const [token, selectedRace, replayInfo, selectedReplayHash] = useSelector(selectData);
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

    const userReplays = useSelector(state => state.raceData[selectedRace].replays);

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

            const races = ['protoss', 'zerg', 'terran'];
            await Promise.all(races.map(async (race) => {
                const url = `${urlPrefix}api/replays/${race}/`;
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
                    dispatch(setReplays(data, race));
                } else {
                    dispatch(setReplays(false, race));
                }
            }));
        };

        if (userReplays === null) {
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
                    const infoList = { user_match_id: replay.user_match_id };
                    Object.entries(replay.match_data).forEach(([stat, values]) => {
                        infoList[stat] = values;
                    });
                    setSelectedReplayInfo(infoList);
                }
            });
        };

        const getReplayTimeline = async () => {
            setCurrentGameloop(0);
            setTimelineData([]);

            let url;
            if (process.env.NODE_ENV === 'development') {
                url = `http://127.0.0.1:8000/api/replays/timeline/${selectedReplayHash}/`;
            } else {
                url = `https://zephyrus.gg/api/replays/timeline/${selectedReplayHash}/`;
            }

            const timelineUrl = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Accept-Encoding': 'gzip',
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => null);

            url = timelineUrl.timeline_url;
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

        setSelectedReplayInfo(null);

        if (userReplays && (userReplays.length > 0)) {
            getSelectedReplay();
        }

        if (selectedReplayHash) {
            getReplayTimeline();
        }
    }, [selectedReplayHash]);

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

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
                    visibleState={props.visibleState}
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
                <ReplayList replayList={replayInfo} />
                :
                <WaveAnimation />
        );
    } else {
        sideBar = (<DefaultResponse />);
    }

    return (
        <div
            className="Replays"
            style={props.visibleState ? {} : { gridTemplateColumns: '1fr 0px' }}
        >
            <div className="Replays__main-content">
                {mainContent}
            </div>
            <div className="Replays__sidebar">
                {sideBar}
            </div>
        </div>
    );
};

export default Replays;
