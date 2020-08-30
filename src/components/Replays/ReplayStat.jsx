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
        <tr
            key={stat}
            className={`
                ReplayStat__stat 
                ${modifier ? `ReplayStat__stat--${modifier}` : ''}
            `}
        >
            <td className="ReplayStat__stat-title">{statName}</td>
            <td
                key={`${category}-${replayInfo[stat][1]}-span`}
                className={`ReplayStat__stat-value ReplayStat__stat-value--${stat}-${player1Highlight} ReplayStat__stat-value--${player1Highlight}`}
            >
                {category === 'PAC'
                    ? replayInfo[stat][1]
                    : Math.round(replayInfo[stat][1])}
            </td>
            <td
                key={`${replayInfo[stat][2]}-span`}
                className={`ReplayStat__stat-value ReplayStat__stat-value--${stat}-${player2Highlight} ReplayStat__stat-value--${player2Highlight}`}
            >
                {category === 'PAC'
                    ? replayInfo[stat][2]
                    : Math.round(replayInfo[stat][2])}
            </td>
        </tr>
    );
};

export default ReplayStat;
