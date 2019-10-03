import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, Fragment } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Line,
} from 'recharts';
import { setReplayList, setReplayInfo } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
// import TimelineArea from './TimelineArea';
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
    // const [timelineStat, setTimelineStat] = useState('resource_collection_rate');
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
            console.log(data);

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

    const formatTick = (content) => {
        const totalSeconds = Math.floor(Number(content) / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        if (String(seconds).length === 1) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    let timeout;
    let prevGameloop = 0;
    const currentTimelineState = cachedTimeline[currentGameloop];

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
                            <h2 className="replay-info__player-name">
                                {selectedReplay.players[1].name.slice(clanTagIndex(selectedReplay.players[1].name))}
                            </h2>
                            <span className="replay-info__player-details">
                                {selectedReplay.match_data.mmr[1]}&nbsp;&nbsp;&nbsp;
                                <span className="replay-info__player replay-info__player--1">Player 1</span>
                            </span>
                        </div>
                        <div
                            className={
                                `replay-info__player-info replay-info__player-info--player2
                                ${selectedReplay.user_match_id === 2 ? 'replay-info__player-info--user' : ''}`
                            }
                        >
                            <h2 className="replay-info__player-name">
                                {selectedReplay.players[2].name.slice(clanTagIndex(selectedReplay.players[2].name))}
                            </h2>
                            <span className="replay-info__player-details">
                                {selectedReplay.match_data.mmr[2]}&nbsp;&nbsp;&nbsp;
                                <span className="replay-info__player replay-info__player--2">Player 2</span>
                            </span>
                        </div>
                    </div>
                </div>}
            {selectedReplayHash && timelineData.length > 1 &&
                <Fragment>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timelineData} margin={{ right: 25 }}>
                            <XAxis
                                dataKey="1.gameloop"
                                tickFormatter={content => formatTick(content)}
                            />
                            <YAxis />
                            <CartesianGrid horizontal={false} vertical={false} />
                            <Tooltip
                                formatter={(value, name, payload) => {
                                    if (payload && payload.payload[1].gameloop !== prevGameloop) {
                                        clearTimeout(timeout);
                                        timeout = setTimeout(() => {
                                            setCurrentGameloop(payload.payload[1].gameloop);
                                        }, 10);
                                        prevGameloop = payload.payload[1].gameloop;
                                    }
                                }}
                                isAnimationActive={false}
                                wrapperStyle={{ visibility: 'hidden' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="1.resource_collection_rate.minerals"
                                stroke="red"
                                activeDot={false}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="2.resource_collection_rate.minerals"
                                stroke="blue"
                                activeDot={false}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    {cachedTimeline[currentGameloop] &&
                        <div className="timeline-state">
                            <div className="timeline-state__units">
                                <h2>Units</h2>
                                <div className="timeline-state__info timeline-state__info--live">
                                    {Object.keys(currentTimelineState).map(playerId => (
                                        <div
                                            key={`timeline-state__unit-info-player${playerId}`}
                                            className={`timeline-state__info-player${playerId}`}
                                        >
                                            {currentTimelineState[playerId].unit &&
                                                Object.entries(currentTimelineState[playerId].unit).map(([unitName, unitInfo]) => (
                                                    unitInfo.live > 0 &&
                                                        <Fragment>
                                                            <img
                                                                alt={unitName}
                                                                title={unitName}
                                                                className="timeline-state__image"
                                                                src={`./images/units/${selectedReplay.players[playerId].race}/${unitName}.jpg`}
                                                            />
                                                            <div className="timeline-state__object-count timeline-state__object-count--live">{unitInfo.live}</div>
                                                        </Fragment>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="timeline-state__info timeline-state__info--died">
                                    {Object.keys(currentTimelineState).map(playerId => (
                                        <div
                                            key={`timeline-state__info-player${playerId}`}
                                            className={`timeline-state__info-player${playerId}`}
                                        >
                                            {currentTimelineState[playerId].unit &&
                                                Object.entries(currentTimelineState[playerId].unit).map(([unitName, unitInfo]) => (
                                                    unitInfo.died > 0 &&
                                                        <Fragment>
                                                            <img
                                                                alt={unitName}
                                                                title={unitName}
                                                                className="timeline-state__image timeline-state__image--small"
                                                                src={`./images/units/${selectedReplay.players[playerId].race}/${unitName}.jpg`}
                                                            />
                                                            <div className="timeline-state__object-count timeline-state__object-count--small timeline-state__object-count--died">{unitInfo.died}</div>
                                                        </Fragment>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="timeline-state__buildings">
                                <h2>Buildings</h2>
                                <div className="timeline-state__info timeline-state__info--live">
                                    {Object.keys(currentTimelineState).map(playerId => (
                                        <div
                                            key={`timeline-state__building-info-player${playerId}`}
                                            className={`timeline-state__info-player${playerId}`}
                                        >
                                            {currentTimelineState[playerId].building &&
                                                Object.entries(currentTimelineState[playerId].building).map(([buildingName, buildingInfo]) => (
                                                    buildingInfo.live > 0 &&
                                                        <Fragment>
                                                            <img
                                                                alt={buildingName}
                                                                title={buildingName}
                                                                className="timeline-state__image"
                                                                src={`./images/buildings/${selectedReplay.players[playerId].race}/${buildingName}.jpg`}
                                                            />
                                                            <div className="timeline-state__object-count">{buildingInfo.live}</div>
                                                        </Fragment>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="timeline-state__info timeline-state__info--died">
                                    {Object.keys(currentTimelineState).map(playerId => (
                                        <div
                                            key={`timeline-state__building-info-player${playerId}`}
                                            className={`timeline-state__info-player${playerId}`}
                                        >
                                            {currentTimelineState[playerId].building &&
                                                Object.entries(currentTimelineState[playerId].building).map(([buildingName, buildingInfo]) => (
                                                    buildingInfo.died > 0 &&
                                                        <Fragment>
                                                            <img
                                                                alt={buildingName}
                                                                title={buildingName}
                                                                className="timeline-state__image timeline-state__image--small"
                                                                src={`./images/buildings/${selectedReplay.players[playerId].race}/${buildingName}.jpg`}
                                                            />
                                                            <div className="timeline-state__object-count timeline-state__object-count--small timeline-state__object-count--died">{buildingInfo.died}</div>
                                                        </Fragment>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="timeline-state__info timeline-state__info--in-progress">
                                    {Object.keys(currentTimelineState).map(playerId => (
                                        <div className={`timeline-state__info-player${playerId}`}>
                                            {currentTimelineState[playerId].building &&
                                                Object.entries(currentTimelineState[playerId].building).map(([buildingName, buildingInfo]) => (
                                                    buildingInfo.in_progress > 0 &&
                                                        <Fragment>
                                                            <img
                                                                alt={buildingName}
                                                                title={buildingName}
                                                                className="timeline-state__image timeline-state__image--small"
                                                                src={`./images/buildings/${selectedReplay.players[playerId].race}/${buildingName}.jpg`}
                                                            />
                                                            <div className="timeline-state__object-count timeline-state__object-count--small timeline-state__object-count--in-progress">{buildingInfo.in_progress}</div>
                                                        </Fragment>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>}
                </Fragment>}
            {selectedReplayHash && timelineData.length === 1 && <WaveAnimation />}
            <div className={`replay-info${selectedReplayInfo ? '' : '--default'}`}>
                {!selectedReplayInfo && <h2 className="replay-info__default">Select a replay to view</h2>}
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
