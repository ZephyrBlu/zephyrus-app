import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import React, { useState, useEffect, useContext } from 'react';
import { setReplayInfo } from '../../actions';
import { useAuthCode, useLoadingState } from '../../hooks';
import { clanTagIndex } from '../../utils';
import LoadingState from '../shared/LoadingState';
import ReplayView from './ReplayView';
import ReplayList from './ReplayList';
import './CSS/Replays.css';

const selectData = createSelector(
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (replayInfo, selectedReplayHash) => (
        [replayInfo, selectedReplayHash]
    ),
);

const Replays = () => {
    useAuthCode();
    const dispatch = useDispatch();
    const visibleState = useSelector(state => state.visibleState);
    const [selectedReplay, setSelectedReplay] = useState({
        data: null,
        info: null,
    });
    const [replayInfo, selectedReplayHash] = useSelector(selectData);

    const userReplays = useSelector(state => (
        state.selectedRace
            ? state.raceData[state.selectedRace].replays
            : null
    ));

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
            style={visibleState ? {} : { gridTemplateColumns: '1fr 0px' }}
        >
            <div className="Replays__main-content">
                <ReplayView
                    replay={{
                        ...selectedReplay,
                        hash: selectedReplayHash,
                    }}
                />
            </div>
            <div className="Replays__sidebar">
                <LoadingState
                    startNow
                    success={replayInfo && replayInfo.length > 0}
                    error={replayInfo === false}
                    notFound={replayInfo && replayInfo.length === 0}
                >
                    <ReplayList replays={replayInfo} />
                </LoadingState>
            </div>
        </div>
    );
};

export default Replays;
