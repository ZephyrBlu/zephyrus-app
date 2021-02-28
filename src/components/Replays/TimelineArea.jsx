import React, { useContext, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useFetch } from '../../hooks';
import UrlContext from '../../index';
import ReplaySummary from './ReplaySummary';
import ReplayTimeline from './ReplayTimeline';
import LoadingState from '../shared/LoadingState';

const TimelineArea = ({ replay }) => {
    const urlPrefix = useContext(UrlContext);
    const [token, selectedReplayHash] = useSelector(state => (
        [state.user ? state.user.token : null, state.selectedReplayHash]
    ), shallowEqual);
    const [timelineState, setTimelineState] = useState({
        data: null,
        cached: null,
    });

    if (!localStorage.timelineStat) {
        localStorage.timelineStat = 'resource_collection_rate_all';
    }

    useEffect(() => {
        if (selectedReplayHash) {
            setTimelineState({
                data: null,
                cached: null,
            });
        }
    }, [selectedReplayHash]);

    const url = `${urlPrefix}api/replays/timeline/${selectedReplayHash}/`;
    const timelineUrl = useFetch(url, selectedReplayHash, 'timeline_url', {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
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
                data: replayTimeline,
                cached: timeline,
            });
        } else if (replayTimeline === false) {
            setTimelineState({
                data: false,
                cached: false,
            });
        }
    }, [replayTimeline]);

    return (
        <LoadingState
            defer
            inProgress={selectedReplayHash && !timelineState.data}
            success={replay.data && timelineState.data}
            error={timelineState.data === false}
        >
            <ReplaySummary
                replay={replay}
                timeline={timelineState}
            />
            <ReplayTimeline
                replay={replay}
                timeline={timelineState}
            />
        </LoadingState>
    );
};

export default TimelineArea;
