import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, Fragment } from 'react';
import { setReplayList, setReplayInfo } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
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
    const [timelineStatDropdown, setTimelineStatDropdown] = useState(0);
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
            const url = 'http://127.0.0.1:8000/api/all/';
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

            if (status === 200) {
                dispatch(setReplayList(data));
            } else {
                dispatch(setReplayList(false));
            }
        };

        if (userReplays.length < 1) {
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

        if (userReplays && (userReplays.length > 0)) {
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

            let url = `https://www.googleapis.com/storage/v1/b/sc2-timelines-dev/o/${selectedReplayHash}.json.gz?key=${apiKey}`;
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

    const timelineStatCategories = {
        'resource_collection_rate.minerals': 'Mineral Collection Rate',
        'resource_collection_rate.gas': 'Gas Collection Rate',
        resource_collection_rate_all: 'Total Collection Rate',
        army_value: 'Army Value',
        workers_active: 'Workers Active',
    };

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const pageTitle = 'Replays';

    const getPlayers = () => ({
        1: selectedReplay.players[1].race,
        2: selectedReplay.players[2].race,
    });

    const mainContent = (
        <Fragment>
            {selectedReplayInfo &&
                <div className="replay-info__title-area">
                    <h2 className="replay-info__matchup">
                        {`${selectedReplay.players[1].race.slice(0, 1)}v${selectedReplay.players[2].race.slice(0, 1)}`}
                    </h2>
                    <h2 className="replay-info__map">
                        {selectedReplay.map}
                    </h2>
                    <span className="replay-info__date">
                        {selectedReplay.played_at.slice(0, 1)} Months Ago
                    </span>
                    <span className="replay-info__result">
                        {selectedReplay.win ?
                            <span className="replay-info__result--win">Win</span>
                            :
                            <span className="replay-info__result--loss">Loss</span>
                        }
                        {`\xa0\xa0\xa0\xa0${Math.ceil(selectedReplay.match_length / 60)} min`}
                    </span>
                    <div className="replay-info__players">
                        <div
                            className={
                                `replay-info__player-info replay-info__player-info--player1
                                ${selectedReplay.user_match_id === 1 ? 'replay-info__player-info--user' : ''}`
                            }
                        >
                            <span className="replay-info__player replay-info__player--1">Player 1</span>
                            <h2 className="replay-info__player-name">
                                {selectedReplay.players[1].name.slice(clanTagIndex(selectedReplay.players[1].name))}
                            </h2>
                        </div>
                        <div
                            className={
                                `replay-info__player-info replay-info__player-info--player2
                                ${selectedReplay.user_match_id === 2 ? 'replay-info__player-info--user' : ''}`
                            }
                        >
                            <span className="replay-info__player replay-info__player--2">Player 2</span>
                            <h2 className="replay-info__player-name">
                                {selectedReplay.players[2].name.slice(clanTagIndex(selectedReplay.players[2].name))}
                            </h2>
                        </div>
                    </div>
                    <div className="replay-info__stat-select">
                        <button
                            className="replay-info__stat-toggle"
                            onClick={() => (
                                timelineStatDropdown === 1 ?
                                    setTimelineStatDropdown(0) : setTimelineStatDropdown(1)
                            )}
                        >
                            Mineral Collection Rate
                            <img
                                className="replay-info__selection-arrow"
                                src="../../icons/down-arrow.svg"
                                alt=""
                            />
                        </button>
                        <ul
                            style={{
                                opacity: timelineStatDropdown,
                                zIndex: timelineStatDropdown,
                                maxHeight: timelineStatDropdown === 0 ? '0px' : '150px',
                            }}
                            className={`replay-info__stat-dropdown 
                                ${timelineStatDropdown === 1 ? 'replay-info__stat-dropdown--open' : ''}`}
                        >
                            {Object.entries(timelineStatCategories).map(([statKey, statName]) => (
                                <li key={statName} className="replay-info__dropdown-option">
                                    <button
                                        key={statName}
                                        className="replay-info__dropdown-button"
                                        onClick={() => (setTimelineStat(statKey))}
                                    >
                                        {statName}&nbsp;&nbsp;
                                        <svg height="10" width="10">
                                            <circle
                                                className="replay-info__stat-dropdown-indicator"
                                                cx="5"
                                                cy="5"
                                                r="5"
                                                fill="hsl(210, 68%, 47%)"
                                                opacity={
                                                    statKey === timelineStat ?
                                                        '1' : '0'
                                                }
                                            />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}
            {selectedReplayHash && (timelineData.length > 1 ?
                <TimelineArea
                    timelineData={timelineData}
                    timeline={cachedTimeline}
                    timelineStat={timelineStat}
                    gameloop={currentGameloop}
                    setGameloop={setCurrentGameloop}
                    players={getPlayers()}
                /> : <WaveAnimation />)}
            <div className={`replay-info${selectedReplayInfo ? '' : '--default'}`}>
                {!selectedReplayInfo &&
                    <h2 className="replay-info__default">Select a replay to view</h2>}
                {selectedReplayInfo &&
                    <div className="replay-info__stats">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                type="replays"
                                category={category}
                                replayInfo={selectedReplayInfo}
                            />
                        ))}
                    </div>}
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
