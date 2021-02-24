import React, { useContext, useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useFetch } from '../../hooks';
import { clanTagIndex } from '../../utils';
import UrlContext from '../../index';
import ReplaySummary from './ReplaySummary';
import ReplayTimeline from './ReplayTimeline';
import LoadingAnimation from '../shared/LoadingAnimation';

const TimelineArea = ({ replay }) => {
    const urlPrefix = useContext(UrlContext);
    const user = useSelector(state => state.user);
    const selectedReplayHash = useSelector(state => state.selectedReplayHash);
    const [timelineState, setTimelineState] = useState({
        data: null,
        loadingState: 'INITIAL',
    });

    if (!localStorage.timelineStat) {
        localStorage.timelineStat = 'resource_collection_rate_all';
    }

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

    const getPlayers = () => ({
        1: {
            name: replay.data.players[1].name.slice(clanTagIndex(replay.data.players[1].name)),
            race: replay.data.players[1].race,
            mmr: replay.data.match_data.mmr[1],
        },
        2: {
            name: replay.data.players[2].name.slice(clanTagIndex(replay.data.players[2].name)),
            race: replay.data.players[2].race,
            mmr: replay.data.match_data.mmr[2],
        },
    });

    return (
        replay.data && timelineState.data?.data
        ? (
            <Fragment>
                <ReplaySummary
                    replay={replay}
                    timeline={timelineState.data}
                />
                <ReplayTimeline
                    replay={replay}
                    timeline={timelineState.data}
                    players={getPlayers()}
                />
            </Fragment>
        ) : null
    );
};

export default TimelineArea;
