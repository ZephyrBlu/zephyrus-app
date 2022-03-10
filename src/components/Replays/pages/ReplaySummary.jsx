import React from 'react';
import StatCategory from '../../shared/StatCategory';
import './CSS/ReplaySummary.css';

const ReplaySummary = ({ replay }) => {
    return (
        <div className="ReplaySummary">
            {replay.info &&
                ['general', 'economic', 'efficiency'].map(category => (
                    <StatCategory
                        key={category}
                        category={category}
                        replay={replay}
                    />
                ))}
        </div>
    );
};

export default ReplaySummary;
