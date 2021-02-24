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
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    const dataStates = {
        replayList: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({ _replayInfo }) => (
                <ReplayList replays={_replayInfo} />
            ),
            NOT_FOUND: (<DefaultResponse content="We couldn't find any replays" />),
            ERROR: (<DefaultResponse content="Something went wrong" />),
        },
    };

    const replayListData = {
        data: { _replayInfo: replayInfo },
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
