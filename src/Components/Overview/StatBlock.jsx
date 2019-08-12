import MainStat from './MainStat';
import RaceStat from './RaceStat';
import './CSS/StatBlock.css';

const StatBlock = (props) => {
    const games = {
        win: 10,
        loss: 20,
    };

    let classModifier;
    if (props.classModifier) {
        classModifier = `StatBlock--${props.classModifier}`;
    } else {
        classModifier = '';
    }

    return (
        <div className={`StatBlock ${classModifier}`}>
            {props.title &&
                <h2 className="StatBlock__title">{props.title}</h2>
            }
            <div className="StatBlock__content">
                <MainStat
                    statName={props.statName}
                />
                <RaceStat
                    classModifier="position-1"
                    winrate={55}
                    matchup="PvP"
                    games={games}
                />
                <RaceStat
                    classModifier="position-2"
                    winrate={55}
                    matchup="PvP"
                    games={games}
                />
                <RaceStat
                    classModifier="position-3"
                    winrate={55}
                    matchup="PvP"
                    games={games}
                />
            </div>
        </div>
    );
};

export default StatBlock;
