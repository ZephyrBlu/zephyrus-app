import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import LoadingAnimation from './shared/LoadingAnimation';
import DefaultResponse from './shared/DefaultResponse';
import './Winrate.css';

const Winrate = () => {
    const selectedRace = useSelector(state => state.selectedRace);
    const currentWinrate = useSelector(state => state.raceData[state.selectedRace].winrate);
    const [formattedData, setFormattedData] = useState(null);
    const [sortBy, setSortBy] = useState('byMap');
    const prevSortBy = useRef(null);

    useEffect(() => {
        // need to reset data for animations to re-trigger
        prevSortBy.current = null;
        setFormattedData(null);
    }, [selectedRace]);

    useEffect(() => {
        if (selectedRace && currentWinrate && !formattedData) {
            const isCurrentSeason = Object.values(currentWinrate).some(matchup => (
                matchup && matchup.seasons.current
            ));

            let season;
            if (isCurrentSeason) {
                season = 'current';
            } else {
                season = 'previous';
            }

            let overallWinrate;
            const matchupData = [];
            const mapData = [];
            const byMatchupData = [];
            const byMapData = [];
            const rawByMatchupData = {};
            const rawByMapData = {};
            Object.entries(currentWinrate).forEach(([matchupName, values]) => {
                if (!values) {
                    return;
                }

                const { maps, ...matchup } = values.seasons[season];
                matchup.map = 'all';
                matchup.matchup = matchupName;

                if (matchupName !== 'all') {
                    matchupData.push(matchup);
                    rawByMatchupData[matchupName] = [matchup];
                } else {
                    overallWinrate = matchup;
                }

                Object.entries(maps).forEach(([mapName, mapValues]) => {
                    if (!Object.keys(rawByMapData).includes(mapName)) {
                        rawByMapData[mapName] = [];
                    }

                    mapValues.map = mapName;
                    mapValues.matchup = matchupName;
                    rawByMapData[mapName].push(mapValues);

                    if (matchupName !== 'all' && mapName !== 'all') {
                        rawByMatchupData[matchupName].push(mapValues);
                    }
                });
            });

            Object.values(rawByMatchupData).forEach((values) => {
                byMatchupData.push(values);
            });

            Object.values(rawByMapData).forEach((values) => {
                byMapData.push(values);
                const currentMapData = {
                    map: values[0].map,
                    matchup: 'all',
                    winrate: null,
                    wins: 0,
                    losses: 0,
                };
                values.forEach((matchup) => {
                    currentMapData.wins += matchup.wins;
                    currentMapData.losses += matchup.losses;
                });
                currentMapData.winrate = Number(((currentMapData.wins / (currentMapData.wins + currentMapData.losses)) * 100).toFixed(1));
                mapData.push(currentMapData);
            });

            const winrateComparator = (a, b) => {
                if (
                    (b.map === 'all' && a.map !== 'all')
                    || (b.matchup === 'all' && a.matchup !== 'all')
                ) {
                    return 1;
                }

                if (
                    (b.map === 'all' && a.map !== 'all')
                    || (a.matchup === 'all' && b.matchup !== 'all')
                ) {
                    return -1;
                }

                if (a.winrate < b.winrate) {
                    return 1;
                }

                if (a.winrate > b.winrate) {
                    return -1;
                }

                return 0;
            };

            const byMatchupComparator = (a, b) => {
                let allWinrateA;
                let allWinrateB;
                a.forEach((values) => {
                    if (values.map === 'all') {
                        allWinrateA = values.winrate;
                    }
                });
                b.forEach((values) => {
                    if (values.map === 'all') {
                        allWinrateB = values.winrate;
                    }
                });

                if (allWinrateA < allWinrateB) {
                    return 1;
                }

                if (allWinrateA > allWinrateB) {
                    return -1;
                }

                return 0;
            };

            const byMapComparator = (a, b) => {
                let allWinrateA;
                let allWinrateB;
                a.forEach((values) => {
                    if (values.matchup === 'all') {
                        allWinrateA = values.winrate;
                    }
                });
                b.forEach((values) => {
                    if (values.matchup === 'all') {
                        allWinrateB = values.winrate;
                    }
                });

                if (allWinrateA < allWinrateB) {
                    return 1;
                }

                if (allWinrateA > allWinrateB) {
                    return -1;
                }

                return 0;
            };
            matchupData.sort(winrateComparator);
            mapData.sort(winrateComparator);
            byMatchupData.sort(byMatchupComparator);
            byMatchupData.forEach(map => map.sort(winrateComparator));
            byMapData.sort(byMapComparator);
            byMapData.forEach(map => map.sort(winrateComparator));

            setFormattedData({
                total: { ...overallWinrate },
                matchups: matchupData,
                maps: mapData,
                byMatchup: byMatchupData,
                byMap: byMapData,
            });
        }
    }, [selectedRace, currentWinrate, formattedData]);

    useEffect(() => {
        const bars = {
            rect: [...document.getElementsByClassName('Winrate__value-bar--rect')],
            path: [...document.getElementsByClassName('Winrate__value-bar--path')],
        };

        // exit early if there are no bars rendered yet
        if (bars.rect.length === 0 && bars.path.length === 0) {
            return;
        }

        const keyframes = {
            rect: bar => [
                { width: '0%' },
                { width: `${Number(bar.dataset.value)}%` },
            ],
            path: bar => [
                { strokeDashoffset: Number(bar.dataset.value) },
                { strokeDashoffset: 0 },
            ],
        };

        Object.entries(bars).forEach(([barType, valueBars]) => {
            valueBars.forEach((bar) => {
                if (barType === 'rect' && prevSortBy.current) {
                    return;
                }

                bar.animate(keyframes[barType](bar), {
                    delay: prevSortBy.current ? Number(bar.dataset.delay) - 400 : Number(bar.dataset.delay),
                    duration: 800,
                    easing: 'cubic-bezier(.15, .2, .2, 1)',
                    fill: 'forwards',
                });
            });
        });
        prevSortBy.current = sortBy;
    }, [formattedData, sortBy]);

    const raceColours = {
        all: 'hsl(210, 68%, 47%)',
        protoss: 'hsl(50, 80%, 45%)',
        terran: 'hsl(15, 90%, 40%)',
        zerg: 'hsl(270, 80%, 35%)',
    };

    return (
        <div className="Winrate">
            <h1 className="Winrate__title">
                Winrate
            </h1>
            {!currentWinrate && !formattedData && <LoadingAnimation />}
            {currentWinrate === false && <DefaultResponse content="We couldn't find any replays" />}
            <div className="Winrate__winrate-data">
                {formattedData &&
                    <Fragment>
                        <div className="Winrate__values-container Winrate__values-container--total">
                            <h2 className="Winrate__values-name Winrate__values-name--total">
                                Overall
                            </h2>
                            <h2 className="Winrate__values Winrate__values--total">
                                {formattedData.total.winrate}%<small>({formattedData.total.wins}/{formattedData.total.wins + formattedData.total.losses})</small>
                            </h2>
                            <svg
                                className="Winrate__value-bar-wrapper Winrate__value-bar-wrapper--rect  Winrate__value-bar-wrapper--all"
                                viewBox="0 0 100 4"
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    data-value={formattedData.total.winrate}
                                    data-delay={0}
                                    width={0}
                                    height={4}
                                    fill={raceColours.all}
                                    rx={0.5}
                                    ry={1}
                                    className="Winrate__value-bar Winrate__value-bar--rect Winrate__value-bar-wrapper--all"
                                />
                            </svg>
                        </div>
                        <div className="Winrate__data-container Winrate__data-container--matchup">
                            {formattedData.matchups.map((values, index) => (
                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--matchup">
                                    <h2 className="Winrate__values-name Winrate__values-name--matchup">
                                        vs {values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}
                                    </h2>
                                    <h2 className="Winrate__values Winrate__values--matchup">
                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                    </h2>
                                    <svg
                                        className={`
                                            Winrate__value-bar-wrapper
                                            Winrate__value-bar-wrapper--rect
                                            Winrate__value-bar-wrapper--${values.matchup}
                                        `}
                                        viewBox="0 0 100 4"
                                        preserveAspectRatio="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            data-value={values.winrate}
                                            data-delay={200 + (70 * (index))}
                                            width={0}
                                            height={4}
                                            fill={raceColours[values.matchup]}
                                            rx={2}
                                            ry={1}
                                            className={`
                                                Winrate__value-bar
                                                Winrate__value-bar--rect
                                                Winrate__value-bar--${values.matchup}
                                            `}
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        <div className="Winrate__data-container Winrate__data-container--map">
                            {formattedData.maps.map((values, index) => (
                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--map">
                                    <h2 className="Winrate__values-name Winrate__values-name--map">
                                        {values.map.charAt(0).toUpperCase() + values.map.slice(1)}
                                    </h2>
                                    <h2 className="Winrate__values">
                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                    </h2>
                                    <svg
                                        className={`
                                            Winrate__value-bar-wrapper
                                            Winrate__value-bar-wrapper--rect
                                            Winrate__value-bar-wrapper--${values.matchup}
                                        `}
                                        viewBox="0 0 100 4"
                                        preserveAspectRatio="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            data-value={values.winrate}
                                            data-delay={200 + (70 * (index))}
                                            width={0}
                                            height={4}
                                            fill={raceColours[values.matchup]}
                                            rx={1}
                                            ry={1}
                                            className={`
                                                Winrate__value-bar
                                                Winrate__value-bar--rect
                                                Winrate__value-bar--${values.matchup}
                                            `}
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        <div className="Winrate__data-container Winrate__data-container--order-by">
                            <div className="Winrate__header">
                                <h2 className="Winrate__title Winrate__title--secondary">
                                    Winrate Breakdown
                                </h2>
                                <div
                                    className={`
                                        Winrate__controls
                                        ${sortBy === 'byMatchup' ? 'Winrate__controls--matchup' : 'Winrate__controls--map'}
                                    `}
                                >
                                    <button
                                        className="Winrate__control-option"
                                        type="button"
                                        onClick={() => setSortBy('byMatchup')}
                                    >
                                        By Matchup
                                    </button>
                                    <button
                                        className="Winrate__control-option"
                                        type="button"
                                        onClick={() => setSortBy('byMap')}
                                    >
                                        By Map
                                    </button>
                                </div>
                            </div>
                            {sortBy === 'byMap' &&
                                <div className="Winrate__order-groups">
                                    {formattedData.byMap.map(matchupData => (
                                        <div className="Winrate__group-container">
                                            {matchupData.map((values, index) => (
                                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--order-by">
                                                    <h2 className={`Winrate__values-name ${index === 0 ? 'Winrate__values-name--title' : ''}`}>
                                                        {index === 0
                                                            ? values.map
                                                            : `vs ${values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}`}
                                                    </h2>
                                                    <h2 className="Winrate__values">
                                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                                    </h2>
                                                    <svg
                                                        className={`
                                                            Winrate__value-bar-wrapper
                                                            Winrate__value-bar-wrapper--path
                                                            Winrate__value-bar-wrapper--${values.matchup}
                                                        `}
                                                        viewBox={`0 0 ${window.innerWidth <= 1200 ? 101 : 100.5} 1`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            data-value={values.winrate}
                                                            data-delay={400 + (70 * (index))}
                                                            d={`M${window.innerWidth <= 1200 ? 1 : 0.5},0.5 L${values.winrate},0.5`}
                                                            className={`
                                                                Winrate__value-bar
                                                                Winrate__value-bar--path
                                                                Winrate__value-bar--${values.matchup}
                                                            `}
                                                            stroke={raceColours[values.matchup]}
                                                            strokeWidth={window.innerWidth <= 1200 ? 2 : 1}
                                                            strokeLinecap="round"
                                                            strokeDasharray={values.winrate}
                                                            strokeDashoffset={values.winrate}
                                                        />
                                                    </svg>
                                                </div>))}
                                        </div>
                                    ))}
                                </div>}
                            {sortBy === 'byMatchup' &&
                                <div className="Winrate__order-groups">
                                    {formattedData.byMatchup.map(mapData => (
                                        <div className="Winrate__group-container">
                                            {mapData.map((values, index) => (
                                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--order-by">
                                                    <h2 className={`Winrate__values-name ${index === 0 ? 'Winrate__values-name--title' : ''}`}>
                                                        {index === 0
                                                            ? `vs ${values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}`
                                                            : values.map}
                                                    </h2>
                                                    <h2 className="Winrate__values">
                                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                                    </h2>
                                                    <svg
                                                        className={`
                                                            Winrate__value-bar-wrapper
                                                            Winrate__value-bar-wrapper--path
                                                            Winrate__value-bar-wrapper--${index === 0 ? 'all' : values.matchup}
                                                        `}
                                                        viewBox={`0 0 ${window.innerWidth <= 1200 ? 101 : 100.5} 1`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            data-value={values.winrate}
                                                            data-delay={400 + (70 * (index))}
                                                            d={`M${window.innerWidth <= 1200 ? 1 : 0.5},0.5 L${values.winrate},0.5`}
                                                            className={`
                                                                Winrate__value-bar
                                                                Winrate__value-bar--path
                                                                Winrate__value-bar--${index === 0 ? 'all' : values.matchup}
                                                            `}
                                                            stroke={index === 0 ? raceColours.all : raceColours[values.matchup]}
                                                            strokeWidth={window.innerWidth <= 1200 ? 2 : 1}
                                                            strokeLinecap="round"
                                                            strokeDasharray={values.winrate}
                                                            strokeDashoffset={values.winrate}
                                                        />
                                                    </svg>
                                                </div>))}
                                        </div>
                                    ))}
                                </div>}
                        </div>
                    </Fragment>}
            </div>
        </div>
    );
};

export default Winrate;
