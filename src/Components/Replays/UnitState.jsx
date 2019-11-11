import { Fragment } from 'react';
import './CSS/TimelineState.css';
import './CSS/UnitState.css';

const UnitState = (props) => {
    const unitStates = ['live', 'died'];
    const ignoreUnits = ['LocustMP', 'BroodlingEscort'];
    let unitsRendered = 0;
    const windowSize = window.innerWidth;
    let unitLimit;

    if (windowSize <= 1400) {
        unitLimit = 6;
    } else if (windowSize <= 1500) {
        unitLimit = 7;
    } else if (windowSize <= 1700) {
        unitLimit = 8;
    } else {
        unitLimit = 10;
    }

    const insertBreak = () => {
        const isBreak = (unitsRendered >= unitLimit && unitsRendered % unitLimit === 0) ?
            <br /> : null;
        unitsRendered += 1;

        return isBreak;
    };

    return (
        unitStates.map(state => (
            <div key={`${state}-div`} className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 key={`${state}-title`} className="state-info-title">
                    Units {state.charAt(0).toUpperCase() + state.slice(1)}
                </h2>
                {Object.keys(props.timelineState).map((playerId) => {
                    unitsRendered = 0;

                    return (
                        <div
                            key={`timeline-state__unit-info-player${playerId}`}
                            className={`timeline-state__info-player${playerId}`}
                        >
                            {props.timelineState[playerId].unit &&
                                Object.entries(props.timelineState[playerId].unit).map(([unitName, unitInfo]) => (
                                    unitInfo[state] > 0 && !(ignoreUnits.includes(unitName)) && !(state === 'died' && unitName === 'Larva') &&
                                        <Fragment key={`${unitName}-${state}-frag`}>
                                            {insertBreak()}
                                            <img
                                                key={`${unitName}-${state}-img`}
                                                alt={unitName}
                                                title={unitName}
                                                className="timeline-state__image"
                                                src={`./images/unit/${props.players[playerId].race}/${unitName}.jpg`}
                                            />
                                            <div
                                                key={`${unitName}-${state}-div`}
                                                className={`timeline-state__object-count timeline-state__object-count--${state}`}
                                            >
                                                {unitInfo[state]}
                                            </div>
                                        </Fragment>
                                ))}
                        </div>
                    );
                })}
            </div>
        ))
    );
};

export default UnitState;
