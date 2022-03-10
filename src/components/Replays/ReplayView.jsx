import React, { useState } from 'react';
import LoadingState from '../shared/LoadingState';
import ErrorBoundary from '../shared/ErrorBoundary';
import TimelineArea from './TimelineArea';
import ReplayInfo from './ReplayInfo';
import ReplayNav from './ReplayNav';
import ReplaySummary from './pages/ReplaySummary';
import './CSS/ReplayView.css';

const ReplayView = ({ replay, isReplayListVisible }) => {
    const [currentPage, setCurrentPage] = useState('Summary');

    const renderPage = () => {
        switch (currentPage) {
            case 'Summary':
                return <ReplaySummary replay={replay} />;

            case 'Timeline':
                return <TimelineArea replay={replay} isReplayListVisible={isReplayListVisible} />;

            default:
                return null;
        }
    };

    return (
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
                    <ReplayNav page={currentPage} setPage={setCurrentPage} />
                    <div className="ReplayView__page">
                        {renderPage()}
                    </div>
                </LoadingState>
            </ErrorBoundary>
        </section>
    );
};

export default ReplayView;
