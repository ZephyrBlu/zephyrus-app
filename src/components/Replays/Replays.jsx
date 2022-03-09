import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setReplayInfo } from '../../actions';
import { clanTagIndex } from '../../utils';
import ErrorBoundary from '../shared/ErrorBoundary';
import LoadingState from '../shared/LoadingState';
import ReplayInfo from './ReplayInfo';
import ReplayNav from './ReplayNav';
import ReplayView from './ReplayView';
import ReplayList from './ReplayList';
import './CSS/Replays.css';

const Replays = ({ isReplayListVisible }) => {
    const dispatch = useDispatch();

    // need to use shallowEqual as this returns an object which will execute on every re-render
    // but we actually only care if the values inside the object change
    const [userReplays, replayInfo, selectedReplayHash] = useSelector(state => ([
        state.selectedRace ? state.replays[state.selectedRace] : null,
        state.replayInfo,
        state.selectedReplayHash,
    ]), shallowEqual);
    const [selectedReplay, setSelectedReplay] = useState({
        data: null,
        info: null,
    });

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
        } else if (userReplays === false) {
            dispatch(setReplayInfo(false));
        }
    }, [userReplays]);

    useEffect(() => {
        const getSelectedReplay = () => {
            userReplays.forEach((replay) => {
                if (replay.file_hash === selectedReplayHash) {
                    const infoList = { user_match_id: replay.user_match_id };
                    Object.entries(replay.match_data).forEach(([stat, values]) => {
                        infoList[stat] = values;
                    });
                    setSelectedReplay({
                        data: replay,
                        info: infoList,
                    });
                }
            });
        };

        if (userReplays) {
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    return (
        <div
            className="Replays"
            style={isReplayListVisible ? {} : { gridTemplateColumns: '1fr 0px' }}
        >
            <ErrorBoundary>
                {selectedReplay.data &&
                    <div class="ReplayHeader">
                        <ReplayInfo
                            replay={selectedReplay}
                            isReplayListVisible={isReplayListVisible}
                        />
                        <ReplayNav />
                    </div>}
                <ReplayView
                    replay={{
                        ...selectedReplay,
                        hash: selectedReplayHash,
                    }}
                    isReplayListVisible={isReplayListVisible}
                />
            </ErrorBoundary>
            <div className="Replays__sidebar">
                <ErrorBoundary>
                    <LoadingState
                        success={replayInfo && replayInfo.length > 0}
                        error={replayInfo === false}
                        notFound={replayInfo && replayInfo.length === 0}
                    >
                        <ReplayList replays={replayInfo} />
                    </LoadingState>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Replays;
