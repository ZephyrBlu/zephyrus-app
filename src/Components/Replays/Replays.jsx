import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect } from 'react';
import { setReplayInfo } from '../../actions';
import useFetch from '../../useFetch';
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
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const [timelineError, setTimelineError] = useState(false);

    if (!localStorage.timelineStat) {
        localStorage.timelineStat = 'resource_collection_rate_all';
    }

    const [timelineStat, setTimelineStat] = useState(localStorage.timelineStat);
    const [user, replayInfo, selectedReplayHash] = useSelector(selectData);
    const [cachedTimeline, setCachedTimeline] = useState(null);
    const [currentGameloop, setCurrentGameloop] = useState(0);
    const [timelineData, setTimelineData] = useState(null);

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

    let url;
    if (process.env.NODE_ENV === 'development') {
        url = `http://127.0.0.1:8000/api/replays/timeline/${selectedReplayHash}/`;
    } else {
        url = `https://zephyrus.gg/api/replays/timeline/${selectedReplayHash}/`;
    }

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
            setTimelineData(replayTimeline);

            const timeline = {};
            replayTimeline.forEach((gamestate) => {
                timeline[gamestate[1].gameloop] = gamestate;
            });
            setCachedTimeline(timeline);
        } else if (replayTimeline === false) {
            setTimelineError(true);
        }
    }, [replayTimeline]);

    useEffect(() => {
        setSelectedReplayInfo(null);
        setTimelineData(null);
        setTimelineError(false);

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
