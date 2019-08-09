import './CSS/RaceStat.css';

const RaceStat = (props) => {
    let modifierClass;
    if (props.classModifier) {
        modifierClass = `stat-block__race-stat--${props.classModifier}`;
    } else {
        modifierClass = '';
    }

    return (
        <div
            className={`stat-block__race-stat ${modifierClass}`}
        >
            <h1 className="stat-block__winrate">{props.winrate}%</h1>
            <h5 className="stat-block__matchup">{props.matchup}</h5>
            <h5 className="stat-block__games">{props.games.win}-{props.games.loss}</h5>
        </div>
    );
};

export default RaceStat;
