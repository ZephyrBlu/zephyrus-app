import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect } from 'react';
import { setReplays, setReplayCount, setReplayInfo } from '../../actions';
import ReplayView from './ReplayView';
import ReplayList from './ReplayList';
import DefaultResponse from '../General/DefaultResponse';
import WaveAnimation from '../General/WaveAnimation';
import './CSS/Replays.css';

const selectData = createSelector(
    state => state.user,
    state => state.selectedRace,
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (user, selectedRace, replayInfo, selectedReplayHash) => (
        [user, selectedRace, replayInfo, selectedReplayHash]
    ),
);

const Replays = (props) => {
    const dispatch = useDispatch();
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const [timelineController, setTimelineController] = useState(null);
    const [timelineError, setTimelineError] = useState(false);

    if (!localStorage.timelineStat) {
        localStorage.timelineStat = 'resource_collection_rate_all';
    }

    const [timelineStat, setTimelineStat] = useState(localStorage.timelineStat);
    const [user, selectedRace, replayInfo, selectedReplayHash] = useSelector(selectData);
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
        const requestControllers = [];
        const getUserReplays = async () => {
            let urlPrefix;
            if (process.env.NODE_ENV === 'development') {
                urlPrefix = 'http://127.0.0.1:8000/';
            } else {
                urlPrefix = 'https://zephyrus.gg/';
            }

            const races = ['protoss', 'zerg', 'terran'];
            races.forEach(async (race) => {
                const url = `${urlPrefix}api/replays/${race}/`;
                const controller = new AbortController();
                requestControllers.push(controller);
                const signal = controller.signal;
                let status;

                const data = await fetch(url, {
                    method: 'GET',
                    signal,
                    headers: { Authorization: `Token ${user.token}` },
                }).then((response) => {
                    status = response.status;
                    return response.json();
                }).then(responseBody => (
                    responseBody
                )).catch(() => null);

                if (status === 200 && data.length > 0) {
                    const countUrl = `${url}count/`;
                    const countController = new AbortController();
                    requestControllers.push(countController);
                    const countSignal = controller.signal;
                    let countStatus;

                    const countResponse = await fetch(countUrl, {
                        method: 'GET',
                        countSignal,
                        headers: { Authorization: `Token ${user.token}` },
                    }).then((response) => {
                        countStatus = response.status;
                        return response.json();
                    }).catch(() => null);

                    dispatch(setReplays(data, race));
                    let replayCount;
                    if (countStatus === 200) {
                        replayCount = countResponse;
                    } else {
                        replayCount = 0;
                    }
                    dispatch(setReplayCount(replayCount, race));
                } else {
                    dispatch(setReplays(false, race));
                    dispatch(setReplayCount(0, race));
                }
            });
        };

        if (userReplays === null) {
            getUserReplays();
        }

        return () => {
            requestControllers.forEach((controller) => {
                controller.abort();
            });
        };
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
            setTimelineError(false);

            let url;
            if (process.env.NODE_ENV === 'development') {
                url = `http://127.0.0.1:8000/api/replays/timeline/${selectedReplayHash}/`;
            } else {
                url = `https://zephyrus.gg/api/replays/timeline/${selectedReplayHash}/`;
            }

            const controller = new AbortController();
            if (timelineController) {
                timelineController.abort();
            }
            setTimelineController(controller);
            const signal = controller.signal;

            const timelineUrl = await fetch(url, {
                method: 'GET',
                signal,
                headers: {
                    Authorization: `Token ${user.token}`,
                    'Accept-Encoding': 'gzip',
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => null);

            if (timelineUrl) {
                url = timelineUrl.timeline_url;
                const data = await fetch(url, { method: 'GET' }).then(response => (
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
            } else {
                setTimelineError(true);
            }
        };

        setSelectedReplayInfo(null);

        if (userReplays && (userReplays.length > 0)) {
            getSelectedReplay();
        }

        if (selectedReplayHash) {
            getReplayTimeline();
        }

        return () => {
            if (timelineController) {
                timelineController.abort();
            }
        };
    }, [selectedReplayHash]);

    let sideBar;
    if (userReplays !== false) {
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
                <ReplayView
                    replay={{
                        data: selectedReplay,
                        info: selectedReplayInfo,
                        hash: selectedReplayHash,
                    }}
                    timeline={{
                        data: timelineData,
                        cached: cachedTimeline,
                        stat: timelineStat,
                        setStat: setTimelineStat,
                        error: timelineError,
                    }}
                    gameloop={{
                        current: currentGameloop,
                        set: setCurrentGameloop,
                    }}
                    clanTagIndex={clanTagIndex}
                    visibleState={props.visibleState}
                />
            </div>
            <div className="Replays__sidebar">
                {sideBar}
            </div>
        </div>
    );
};

export default Replays;
