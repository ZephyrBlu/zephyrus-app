import './CSS/RaceStat.css';

const RaceStat = (props) => {
    let classModifier;
    if (props.classModifier) {
        classModifier = `RaceStat--${props.classModifier}`;
    } else {
        classModifier = '';
    }

    return (
        <div
            className={`RaceStat ${classModifier}`}
        >
            {classModifier ?
                <h2 className="RaceStat__winrate">{props.winrate}%</h2>
                :
                <h3 className="RaceStat__winrate">{props.winrate}%</h3>
            }
            <h5 className="RaceStat__matchup">{props.matchup}</h5>
            <h5 className="RaceStat__games">{props.games.win}-{props.games.loss}</h5>
        </div>
    );
};

export default RaceStat;
