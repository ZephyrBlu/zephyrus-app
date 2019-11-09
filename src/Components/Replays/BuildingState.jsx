import { Fragment } from 'react';
import './CSS/TimelineState.css';
import './CSS/BuildingState.css';

const BuildingState = (props) => {
    const buildingStates = ['live', 'died', 'in_progress'];
    const ignoreBuildings = ['CreepTumor', 'CreepTumorQueen'];
    let unitsRendered = 0;
    const unitLimit = window.innerWidth > 1400 ? 10 : 6;

    const insertBreak = () => {
        const isBreak = (unitsRendered >= unitLimit && unitsRendered % unitLimit === 0) ? <br /> : null;
        unitsRendered += 1;

        return isBreak;
    };

    return (
        buildingStates.map(state => (
            <div className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 className="state-info-title">
                    Buildings {state === 'in_progress' ?
                        'In-progress' : state.charAt(0).toUpperCase() + state.slice(1)}
                </h2>
                {Object.keys(props.timelineState).map((playerId) => {
                    unitsRendered = 0;

                    return (
                        <div
                            key={`timeline-state__building-info-player${playerId}`}
                            className={`timeline-state__info-player${playerId}`}
                        >
                            {props.timelineState[playerId].building &&
                                Object.entries(props.timelineState[playerId].building).map(([buildingName, buildingInfo]) => (
                                    <Fragment>
                                        {buildingInfo[state] > 0 && !(ignoreBuildings.includes(buildingName)) &&
                                            <Fragment>
                                                {insertBreak()}
                                                <img
                                                    alt={buildingName}
                                                    title={buildingName}
                                                    className="timeline-state__image"
                                                    src={`./images/building/${props.players[playerId]}/${buildingName}.jpg`}
                                                />
                                                <div className={`timeline-state__object-count timeline-state__object-count--${state}`}>
                                                    {buildingInfo[state]}
                                                </div>
                                            </Fragment>}
                                    </Fragment>
                                ))}
                        </div>
                    );
                })}
            </div>
        ))
    );
};

export default BuildingState;
