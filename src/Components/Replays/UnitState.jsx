import { Fragment } from 'react';
import './CSS/TimelineState.css';
import './CSS/UnitState.css';

const UnitState = (props) => {
    const unitStates = ['live', 'died'];
    const ignoreUnits = ['LocustMP', 'BroodlingEscort'];
    let unitsRendered = 0;

    const insertBreak = () => {
        const isBreak = (unitsRendered >= 10 && unitsRendered % 10 === 0) ? <br /> : null;
        unitsRendered += 1;

        return isBreak;
    };

    return (
        unitStates.map(state => (
            <div className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 className="state-info-title">
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
                                        <Fragment>
                                            {insertBreak()}
                                            <img
                                                alt={unitName}
                                                title={unitName}
                                                className="timeline-state__image"
                                                src={`./images/unit/${props.players[playerId]}/${unitName}.jpg`}
                                            />
                                            <div
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
