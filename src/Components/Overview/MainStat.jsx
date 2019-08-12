// import { useState } from 'react';
import RaceStat from './RaceStat';
import './CSS/MainStat.css';

const MainStat = (props) => {
    const games = {
        win: 10,
        loss: 20,
    };

    return (
        <div className="MainStat">
            <h2 className="MainStat__title">{props.statName}</h2>
            <RaceStat
                classModifier="main"
                winrate={55}
                matchup="Protoss"
                games={games}
            />
        </div>
    );
};

export default MainStat;
