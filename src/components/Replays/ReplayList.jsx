import React from 'react';
import ReplayRecord from './ReplayRecord';
import ErrorBoundary from '../shared/ErrorBoundary';
import LoadingState from '../shared/LoadingState';
import './CSS/ReplayList.css';

const ReplayList = ({ replays }) => (
    <section className="ReplayList">
        <ErrorBoundary>
            <LoadingState
                success={replays && replays.length > 0}
                error={replays === false}
                notFound={replays && replays.length === 0}
            >
                {replays && replays.map((replayInfo) => {
                    const stats = replayInfo;
                    const { fileHash, ...newStats } = stats;

                    return (
                        <ReplayRecord
                            key={fileHash}
                            hash={fileHash}
                            stats={newStats}
                        />
                    );
                })}
            </LoadingState>
        </ErrorBoundary>
    </section>
);

export default ReplayList;
