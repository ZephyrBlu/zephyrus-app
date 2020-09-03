import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Winrate.css';

const Winrate = () => {
    // const selectedRace = useSelector(state => state.selectedRace);
    const currentWinrate = useSelector(state => state.raceData[state.selectedRace].winrate);
    const [formattedData, setFormattedData] = useState(null);

    useEffect(() => {
        if (currentWinrate) {
            const isCurrentSeason = Object.values(currentWinrate).some(matchup => (
                !!matchup.seasons.current
            ));
            
            let season;
            if (isCurrentSeason) {
                season = 'current';
            } else {
                season = 'previous';
            }

            const matchupData = {};
            const mapData = {};
            Object.entries(currentWinrate).forEach(([matchupName, values]) => {
                const { maps, ...matchup } = values.seasons[season];
                matchupData[matchupName] = matchup;
                Object.entries(maps).forEach(([mapName, mapValues]) => {
                    if (!Object.keys(mapData).includes(mapName)) {
                        mapData[mapName] = {};
                    }
                    mapData[mapName][matchupName] = mapValues;
                });
            });
            setFormattedData({
                matchup: matchupData,
                map: mapData,
            });
        }
    }, [currentWinrate]);

    useEffect(() => {
        const bars = [...document.getElementsByClassName('WinrateSummary__value-bar')];
        bars.forEach((bar) => {
            bar.animate([
                { strokeDashoffset: Number(bar.dataset.value) },
                { strokeDashoffset: 0 },
            ], {
                delay: Number(bar.dataset.delay),
                duration: 800,
                easing: 'cubic-bezier(.15, .2, .2, 1)',
                fill: 'forwards',
            });
        });
    }, [formattedData]);

    console.log('HELLO', formattedData);

    const raceColours = {
        all: 'hsl(210, 68%, 47%)',
        protoss: 'hsl(50, 80%, 45%)',
        terran: 'hsl(15, 90%, 40%)',
        zerg: 'hsl(270, 80%, 35%)',
    };

    return (
        formattedData &&
            <div className="WinrateSummary__winrate-data">
                {Object.entries(formattedData.matchup).map(([matchup, values], index) => (
                    <div key={`${values.winrate}`} className="WinrateSummary__data-point">
                        <h2 className={`WinrateSummary__value-name`}>
                            {matchup}
                        </h2>
                        {console.log('COLOURS', matchup, raceColours[matchup])}
                        <svg
                            className={`WinrateSummary__value-bar-wrapper WinrateSummary__value-bar-wrapper--${matchup}`}
                            viewBox="0 0 102 5"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                data-value={values.winrate + 1}
                                data-delay={100 + (70 * (index))}
                                d={`M1,4 L${values.winrate + 1},4`}
                                className={`WinrateSummary__value-bar WinrateSummary__value-bar--${matchup}`}
                                stroke={raceColours[matchup]}
                                strokeWidth={4}
                                strokeLinecap="round"
                                strokeDasharray={values.winrate + 1}
                                strokeDashoffset={values.winrate + 1}
                            />
                        </svg>
                        <h2 className={`WinrateSummary__values`}>
                            {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                        </h2>
                    </div>
                ))}
            </div>
    );
};

export default Winrate;
