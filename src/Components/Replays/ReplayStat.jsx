import './CSS/ReplayStat.css';

const ReplayStat = (props) => {
    let player1Highlight;
    let player2Highlight;
    if (props.replayInfo[props.stat][1] > props.replayInfo[props.stat][2]) {
        player1Highlight = 'win';
        player2Highlight = 'loss';
    } else {
        player1Highlight = 'loss';
        player2Highlight = 'win';
    }

    return (
        <div
            key={props.stat}
            className={`
                ReplayStat__stat 
                ${props.modifier ? `ReplayStat__stat--${props.modifier}` : ''}
            `}
        >
            <h2 className="ReplayStat__stat-title">{props.statName}</h2>
            <div className={`ReplayStat__stat-value ${props.modifier ? 'ReplayStat__stat-value--last' : ''}`}>
                <span
                    key={`${props.category}-${props.replayInfo[props.stat][1]}-span`}
                    className={`ReplayStat__stat-value--${props.stat}-${player1Highlight} ReplayStat__stat-value--${player1Highlight}`}
                >
                    {props.category === 'PAC' ?
                        props.replayInfo[props.stat][1]
                        :
                        Math.round(props.replayInfo[props.stat][1])}
                </span>
                <span
                    key={`${props.replayInfo[props.stat][2]}-span`}
                    className={`ReplayStat__stat-value--${props.stat}-${player2Highlight} ReplayStat__stat-value--${player2Highlight}`}
                >
                    {props.category === 'PAC' ?
                        props.replayInfo[props.stat][2]
                        :
                        Math.round(props.replayInfo[props.stat][2])}
                </span>
            </div>
        </div>
    );
};

export default ReplayStat;
