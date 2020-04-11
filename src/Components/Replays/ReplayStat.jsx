import './CSS/ReplayStat.css';

const ReplayStat = ({ stat, statName, replayInfo, category, modifier }) => {
    let player1Highlight;
    let player2Highlight;
    if (replayInfo[stat][1] > replayInfo[stat][2]) {
        player1Highlight = 'win';
        player2Highlight = 'loss';
    } else {
        player1Highlight = 'loss';
        player2Highlight = 'win';
    }

    return (
        <div
            key={stat}
            className={`
                ReplayStat__stat 
                ${modifier ? `ReplayStat__stat--${modifier}` : ''}
            `}
        >
            <h2 className="ReplayStat__stat-title">{statName}</h2>
            <div className={`ReplayStat__stat-value ${modifier ? 'ReplayStat__stat-value--last' : ''}`}>
                <span
                    key={`${category}-${replayInfo[stat][1]}-span`}
                    className={`ReplayStat__stat-value--${stat}-${player1Highlight} ReplayStat__stat-value--${player1Highlight}`}
                >
                    {category === 'PAC' ? /* eslint-disable-line no-nested-ternary */
                        replayInfo[stat][1]
                        :
                        stat === 'workers_killed' || stat === 'workers_lost' ? Math.round(replayInfo[stat][1]) - 12 : Math.round(replayInfo[stat][1]) /* eslint-disable-line no-nested-ternary */}
                </span>
                <span
                    key={`${replayInfo[stat][2]}-span`}
                    className={`ReplayStat__stat-value--${stat}-${player2Highlight} ReplayStat__stat-value--${player2Highlight}`}
                >
                    {category === 'PAC' ? /* eslint-disable-line no-nested-ternary */
                        replayInfo[stat][2]
                        :
                        stat === 'workers_killed' || stat === 'workers_lost' ? Math.round(replayInfo[stat][2]) - 12 : Math.round(replayInfo[stat][2]) /* eslint-disable-line no-nested-ternary */}
                </span>
            </div>
        </div>
    );
};

export default ReplayStat;
