// import { useState } from 'react';
import RaceStat from './RaceStat';
import './CSS/MainStat.css';

const MainStat = () => {
    const games = {
        win: 10,
        loss: 20,
    };

    return (
        <div className="stat-block__main-stat">
            <h1 className="stat-block__title">Main Stat Name</h1>
            <RaceStat
                classModifier="main"
                winrate={55}
                matchup="PvP"
                games={games}
            />
        </div>
    );
};

export default MainStat;
