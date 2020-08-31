import React from 'react';
import ReplayRecord from './ReplayRecord';
import './CSS/ReplayList.css';

const ReplayList = ({ replays, comparisonHash, handleReplayComparison }) => (
    <section className="ReplayList">
        {replays.map((replayInfo) => {
            const stats = replayInfo;
            const { fileHash, ...newStats } = stats;

            return (
                <ReplayRecord
                    key={fileHash}
                    hash={fileHash}
                    comparisonHash={comparisonHash}
                    stats={newStats}
                    compareReplay={handleReplayComparison}
                />
            );
        })}
    </section>
);

export default ReplayList;
