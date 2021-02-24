import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import React, { useState, useEffect, useContext } from 'react';
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

const Replays = () => {
    useAuthCode();
    const dispatch = useDispatch();
    const visibleState = useSelector(state => state.visibleState);
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
    const [metrics, setMetrics] = useState(null);

    // replay comparison state
    const [selectedComparisonReplay, setSelectedComparisonReplay] = useState(null);
    const [selectedComparisonReplayHash, setSelectedComparisonReplayHash] = useState(null);
    const [comparisonPlayer, setComparisonPlayer] = useState(null);
    const [comparisonTimelineData, setComparisonTimelineData] = useState(null);
    const [splicedTimelineData, setSplicedTimelineData] = useState(null);
    const [cachedSplicedTimeline, setCachedSplicedTimeline] = useState(null);

    useEffect(() => {
        if (!timelineState.data) {
            return;
        }

        const gameMetrics = ['resource_collection_rate_all', 'total_army_value', 'total_resources_lost'];
        const med = (arr) => {
            const sep1 = [];
            const sep2 = [];

            arr.forEach(([t, p]) => {
                sep1.push(t);
                sep2.push(p);
            });

            const data = sep2.map((val) => {
                let limitedVal = Number(val.toFixed(2));

                if (limitedVal > 1) {
                    limitedVal = 1;
                } else if (limitedVal < -1) {
                    limitedVal = -1;
                }

                return { value: limitedVal };
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

                if (a.length % 2) {
                    medians.push(i === 0 ? Math.round(a[half]) : Math.round((a[half] * 100)));
                } else {
                    medians.push(i === 0 ? Math.round((a[half - 1] + a[half]) / 2) : Math.round((((a[half - 1] + a[half]) * 100) / 2)));
                }
            });

            return {
                medians,
                data,
            };
        };
        const currentMetrics = {};

        gameMetrics.forEach((metric) => {
            let ahead = 0;
            let behind = 0;
            const amountAhead = [];
            const amountBehind = [];
            const leadLag = [];

            timelineState.data.data.forEach((gameState) => {
                const userId = selectedReplayState.data.info.user_match_id;
                const oppId = userId === 1 ? 2 : 1;

                const userVal = gameState[userId][metric];
                const oppVal = gameState[oppId][metric];

                let diff;
                if (userVal === 0 && oppVal === 0) {
                    diff = [0, 0];
                } else {
                    diff = [
                        userVal - oppVal,
                        ((Math.min(userVal, oppVal) === 0 ?
                            0 : Math.max(userVal, oppVal) / Math.min(userVal, oppVal)) - 1)
                            * (Math.max(userVal, oppVal) === userVal ? 1 : -1),
                    ];
                }
                if (userVal > oppVal) {
                    ahead += 1;
                    amountAhead.push(diff);
                } else if (userVal < oppVal) {
                    behind += 1;
                    amountBehind.push(diff.map(val => val * -1));
                }
                leadLag.push(diff);
            });

            const leadLagData = med(leadLag);
            currentMetrics[metric] = {
                data: leadLagData.data,
                summary: {
                    ahead: Math.round(((ahead / timelineState.data.data.length) * 100)),
                    behind: Math.round(((behind / timelineState.data.data.length) * 100)),
                    avgAhead: med(amountAhead).medians,
                    avgBehind: med(amountBehind).medians,
                    avgLeadLag: leadLagData.medians,
                },
            };
        });

        setMetrics(currentMetrics);
    }, [timelineState.data]);

    const userReplays = useSelector(state => (
        state.selectedRace
            ? state.raceData[state.selectedRace].replays
            : null
    ));

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

    useEffect(() => {
        const filterReplayInfo = () => {
            const newReplays = [];
            userReplays.forEach((replay) => {
                const userId = replay.user_match_id;
                const oppId = userId === 1 ? 2 : 1;
                const currentReplayInfo = {
                    fileHash: replay.file_hash,
                    matchup: `${replay.players[userId].race.slice(0, 1)}v${replay.players[oppId].race.slice(0, 1)}`,
                    opponentRace: replay.players[oppId].race,
                    map: replay.map,
                    result: `${replay.win ? 'Win' : 'Loss'},\xa0\xa0\xa0\xa0${Math.ceil(replay.match_length / 60)}`,
                    matchLength: Math.ceil(replay.match_length / 60),
                    date: replay.played_at.slice(0, 10),
                    players: {
                        1: {
                            name: replay.players[userId].name.slice(clanTagIndex(replay.players[userId].name)),
                            race: replay.players[userId].race,
                            mmr: replay.match_data.mmr[userId],
                        },
                        2: {
                            name: replay.players[oppId].name.slice(clanTagIndex(replay.players[oppId].name)),
                            race: replay.players[oppId].race,
                            mmr: replay.match_data.mmr[oppId],
                        },
                    },
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
            setComparisonTimelineData(null);
            setSplicedTimelineData(null);
            setCachedSplicedTimeline(null);
            setSelectedComparisonReplay(null);
            setSelectedComparisonReplayHash(null);
            setComparisonPlayer(null);
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    useEffect(() => {
        const getSelectedComparisonReplay = () => {
            userReplays.forEach((replay) => {
                if (replay.file_hash === selectedComparisonReplayHash) {
                    setSelectedComparisonReplay(replay);
                }
            });
        };

        const getReplayTimeline = async () => {
            setComparisonTimelineData([]);
            const comparisonUrl = `${urlPrefix}api/replays/timeline/${selectedComparisonReplayHash}/`;
            const timelineUrlResponse = await fetch(comparisonUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${user.token}`,
                    'Accept-Encoding': 'gzip',
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => null);

            if (timelineUrlResponse) {
                const newTimelineUrl = timelineUrlResponse.timeline_url;
                const data = await fetch(
                    newTimelineUrl,
                    { method: 'GET' },
                ).then(response => (
                    response.json()
                )).then(responseBody => (
                    responseBody
                )).catch(() => null);

                setComparisonTimelineData(data.timeline);
            }
        };

        if (userReplays && (userReplays.length > 0)) {
            getSelectedComparisonReplay();
        }

        if (selectedComparisonReplayHash) {
            getReplayTimeline();
        }
    }, [selectedComparisonReplayHash]);

    useEffect(() => {
        const spliceComparisonTimeline = () => {
            const splicedData = timelineState.data.data.map((gameState, index) => {
                const gameStateCopy = JSON.parse(JSON.stringify(gameState));
                gameStateCopy.comparison = comparisonTimelineData[index];
                return gameStateCopy;
            });
            const timeline = {};
            splicedData.forEach((gamestate) => {
                timeline[gamestate[1].gameloop] = gamestate;
            });
            setCachedSplicedTimeline(timeline);
            setSplicedTimelineData(splicedData);
        };

        if (selectedComparisonReplayHash) {
            spliceComparisonTimeline();
        }
    }, [timelineState, comparisonTimelineData]);

    const handleReplayComparison = (fileHash, player) => {
        if (selectedComparisonReplayHash === fileHash && comparisonPlayer === player) {
            setComparisonTimelineData(null);
            setSplicedTimelineData(null);
            setCachedSplicedTimeline(null);
            setSelectedComparisonReplay(null);
            setSelectedComparisonReplayHash(null);
            setComparisonPlayer(null);
        } else {
            setSelectedComparisonReplayHash(fileHash);
            setComparisonPlayer(player);
        }
    };

    const getComparisonPlayer = () => ({
        id: comparisonPlayer,
        name: selectedComparisonReplay.players[comparisonPlayer].name.slice(clanTagIndex(selectedComparisonReplay.players[comparisonPlayer].name)),
        race: selectedComparisonReplay.players[comparisonPlayer].race,
    });

    const dataStates = {
        replayList: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({ _replayInfo, _selectedComparisonReplayHash }) => (
                <ReplayList
                    replays={_replayInfo}
                    comparisonHash={_selectedComparisonReplayHash}
                    handleReplayComparison={handleReplayComparison}
                />
            ),
            NOT_FOUND: (<DefaultResponse content="We couldn't find any replays" />),
            ERROR: (<DefaultResponse content="Something went wrong" />),
        },
    };

    const replayListData = {
        data: {
            _replayInfo: replayInfo,
            _selectedComparisonReplayHash: selectedComparisonReplayHash,
        },
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
                        metrics,
                        hash: selectedReplayHash,
                    }}
                    timeline={{
                        ...timelineState.data,
                        spliced: splicedTimelineData,
                        comparison: {
                            cached: cachedSplicedTimeline,
                            player: selectedComparisonReplay ? getComparisonPlayer() : null,
                        },
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
