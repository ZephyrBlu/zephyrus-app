import MainStat from './MainStat';
import RaceStat from './RaceStat';
import './CSS/StatBlock.css';

const StatBlock = () => {
    const games = {
        win: 10,
        loss: 20,
    };

    return (
        <div className="stat-block">
            <MainStat />
            <RaceStat
                classModifiermodifier="position-1"
                winrate={55}
                matchup="PvP"
                games={games}
            />
            <RaceStat
                classModifiermodifier="position-2"
                winrate={55}
                matchup="PvP"
                games={games}
            />
            <RaceStat
                classModifiermodifier="position-3"
                winrate={55}
                matchup="PvP"
                games={games}
            />
        </div>
    );
};

export default StatBlock;
