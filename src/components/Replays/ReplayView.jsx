import React from 'react';
import LoadingState from '../shared/LoadingState';
import ErrorBoundary from '../shared/ErrorBoundary';
import TimelineArea from './TimelineArea';
import ReplayInfo from './ReplayInfo';
import ReplayNav from './ReplayNav';
import ReplaySummary from './pages/ReplaySummary';
import './CSS/ReplayView.css';

const ReplayView = ({ replay, isReplayListVisible }) => (
    <section className={`ReplayView ReplayView--${isReplayListVisible ? 'replays' : 'no-replays'}`}>
        <ErrorBoundary>
            <LoadingState
                noLoad
                initial={
                    <h2 className="ReplayView__default">
                        Select a replay to view
                    </h2>
                }
                success={replay.data}
            >
                <ReplayInfo
                    replay={replay}
                    isReplayListVisible={isReplayListVisible}
                />
                <ReplayNav />
                <TimelineArea replay={replay} isReplayListVisible={isReplayListVisible} />
            </LoadingState>
            <ReplaySummary replay={replay} />
        </ErrorBoundary>
    </section>
);

export default ReplayView;
