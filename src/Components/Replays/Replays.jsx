import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect, useContext } from 'react';
import { setReplayInfo } from '../../actions';
import useFetch from '../../useFetch';
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
    const dispatch = useDispatch();
    const urlPrefix = useContext(UrlContext);
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

    let sideBar;
    if (userReplays !== false) {
        sideBar = (
            replayInfo.length > 0 ?
                <ReplayList replays={replayInfo} />
                :
                <LoadingAnimation />
        );
    } else {
        sideBar = (<DefaultResponse />);
    }

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
                {sideBar}
            </div>
        </div>
    );
};

export default Replays;
