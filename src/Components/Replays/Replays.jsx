import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, useContext } from 'react';
import { setReplayInfo } from '../../actions';
import { useFetch, useAuthCode, useLoadingState } from '../../hooks';
import UrlContext from '../../index';
import ReplayView from './ReplayView';
import ReplayList from './ReplayList';
import DefaultResponse from '../shared/DefaultResponse';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/Replays.css';

const selectData = createSelector(
    state => state.user,
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (user, replayInfo, selectedReplayHash) => (
        [user, replayInfo, selectedReplayHash]
    ),
);

const Replays = ({ visibleState }) => {
    useAuthCode();
    const dispatch = useDispatch();
    const urlPrefix = useContext(UrlContext);
    const [replayListState, setReplayListState] = useState({ loadingState: 'IN_PROGRESS' });
    const [selectedReplayState, setSelectedReplayState] = useState({
        data: {
            data: null,
            info: null,
        },
        loadingState: 'INITIAL',
    });
    const [timelineState, setTimelineState] = useState({
        data: null,
        loadingState: 'INITIAL',
    });

    if (!localStorage.timelineStat) {
        localStorage.timelineStat = 'resource_collection_rate_all';
    }

    const [timelineStat, setTimelineStat] = useState(localStorage.timelineStat);
    const [user, replayInfo, selectedReplayHash] = useSelector(selectData);
    const [currentGameloop, setCurrentGameloop] = useState(0);

    const gameMetrics = ['resource_collection_rate_all', 'total_army_value'];
    const metricProperties = ['ahead', 'avgAhead', 'avgLeadLag'];
    const generateMetrics = (m, p) => {
        const generated = {};
        m.forEach((_m) => {
            const internal = {};
            p.forEach((_p) => {
                internal[_p] = null;
            });
            generated[_m] = internal;
        });
        return generated;
    };
    const [metrics, setMetrics] = useState(generateMetrics(gameMetrics, metricProperties));

    console.log(metrics);
    console.log('timeline', timelineState.data);
    console.log(metrics);

    useEffect(() => {
        if (!timelineState.data) {
            return;
        }

        const med = (arr) => {
            const sep1 = [];
            const sep2 = [];

            arr.forEach(([t, p]) => {
                sep1.push(t);
                sep2.push(p);
            });

            sep1.sort((a, b) => (
                a - b
            ));

            sep2.sort((a, b) => (
                a - b
            ));

            const medians = [];

            [sep1, sep2].forEach((a, i) => {
                const half = Math.floor(a.length / 2);

                console.log(a, half, a[half], a[half - 1]);

                if (a.length % 2) {
                    medians.push(i === 0 ? Math.round(a[half]) : Number(a[half].toFixed(3)));
                } else {
                    medians.push(i === 0 ? Math.round((a[half - 1] + a[half]) / 2.0) : Number(((a[half - 1] + a[half]) / 2.0).toFixed(3)));
                }
            });

            return medians;
        };
        const currentMetrics = {};

        gameMetrics.forEach((metric) => {
            let ahead = 0;
            const amountAhead = [];
            const leadLag = [];

            timelineState.data.data.forEach((gameState) => {
                const userId = selectedReplayState.data.info.user_match_id;
                const oppId = userId === 1 ? 2 : 1;

                const diff = [
                    gameState[userId][metric] - gameState[oppId][metric],
                    gameState[oppId][metric] === 0 ?
                        0 : (gameState[userId][metric] / gameState[oppId][metric]) - 1,
                ];
                if (gameState[userId][metric] > gameState[oppId][metric]) {
                    ahead += 1;
                    amountAhead.push(diff);
                }
                leadLag.push(diff);
            });

            console.log(amountAhead, leadLag);

            currentMetrics[metric] = {
                ahead: Number((ahead / timelineState.data.data.length).toFixed(3)),
                avgAhead: med(amountAhead),
                avgLeadLag: med(leadLag),
            };
        });

        setMetrics(currentMetrics);
    }, [timelineState.data]);

    const userReplays = useSelector(state => (
        state.selectedRace
            ? state.raceData[state.selectedRace].replays
            : null
    ));

    const dataStates = {
        replayList: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: data => (<ReplayList replays={data} />),
            NOT_FOUND: (<DefaultResponse content="We couldn't find any replays" />),
            ERROR: (<DefaultResponse content="Something went wrong" />),
        },
    };

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

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

        if (userReplays) {
            filterReplayInfo();
            setReplayListState({ loadingState: userReplays.length > 0 ? 'SUCCESS' : 'NOT_FOUND' });
        } else if (userReplays === false) {
            setReplayListState({ loadingState: 'ERROR' });
        }
    }, [userReplays]);

    const url = `${urlPrefix}api/replays/timeline/${selectedReplayHash}/`;
    const timelineUrl = useFetch(url, selectedReplayHash, 'timeline_url', {
        method: 'GET',
        headers: {
            Authorization: `Token ${user.token}`,
            'Accept-Encoding': 'gzip',
        },
    });
    const replayTimeline = useFetch(timelineUrl, 'default', 'timeline', { method: 'GET' });

    useEffect(() => {
        if (replayTimeline) {
            const timeline = {};
            replayTimeline.forEach((gamestate) => {
                timeline[gamestate[1].gameloop] = gamestate;
            });

            setTimelineState({
                data: {
                    data: replayTimeline,
                    cached: timeline,
                },
                loadingState: 'SUCCESS',
            });
        } else if (replayTimeline === false) {
            setTimelineState(prevState => ({
                ...prevState,
                loadingState: 'ERROR',
            }));
        }
    }, [replayTimeline]);

    useEffect(() => {
        setTimelineState({
            data: null,
            loadingState: 'INITIAL',
        });

        const getSelectedReplay = () => {
            userReplays.forEach((replay) => {
                if (replay.file_hash === selectedReplayHash) {
                    const infoList = { user_match_id: replay.user_match_id };
                    Object.entries(replay.match_data).forEach(([stat, values]) => {
                        infoList[stat] = values;
                    });
                    setSelectedReplayState({
                        data: {
                            data: replay,
                            info: infoList,
                        },
                        loadingState: 'SUCCESS',
                    });
                }
            });
        };

        if (selectedReplayHash) {
            setTimelineState({
                data: null,
                loadingState: 'IN_PROGRESS',
            });
        }

        if (userReplays) {
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    const replayListData = {
        data: replayInfo,
        ...replayListState,
    };
    const ReplayListState = useLoadingState(replayListData, dataStates.replayList);

    return (
        <div
            className="Replays"
            style={visibleState ? {} : { gridTemplateColumns: '1fr 0px' }}
        >
            <div className="Replays__main-content">
                <ReplayView
                    replay={{
                        ...selectedReplayState.data,
                        loading: selectedReplayState.loadingState,
                        hash: selectedReplayHash,
                    }}
                    timeline={{
                        ...timelineState.data,
                        loading: timelineState.loadingState,
                        stat: timelineStat,
                        setStat: setTimelineStat,
                    }}
                    gameloop={{
                        current: currentGameloop,
                        set: setCurrentGameloop,
                    }}
                    clanTagIndex={clanTagIndex}
                    visibleState={visibleState}
                />
            </div>
            <div className="Replays__sidebar">
                <ReplayListState />
            </div>
        </div>
    );
};

export default Replays;
