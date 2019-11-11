import { Fragment } from 'react';
import './CSS/TimelineState.css';
import './CSS/BuildingState.css';

const BuildingState = (props) => {
    const buildingStates = ['live', 'died', 'in_progress'];
    const ignoreBuildings = ['CreepTumor', 'CreepTumorQueen'];
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
        buildingStates.map(state => (
            <div key={`${state}-div`} className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 key={`${state}-title`} className="state-info-title">
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
                                    buildingInfo[state] > 0 && !(ignoreBuildings.includes(buildingName)) &&
                                        <Fragment key={`${buildingName}-${state}-frag`}>
                                            {insertBreak()}
                                            <img
                                                key={`${buildingName}-${state}-img`}
                                                alt={buildingName}
                                                title={buildingName}
                                                className="timeline-state__image"
                                                src={`./images/building/${props.players[playerId].race}/${buildingName}.jpg`}
                                            />
                                            <div
                                                key={`${buildingName}-${state}-div`}
                                                className={`timeline-state__object-count timeline-state__object-count--${state}`}
                                            >
                                                {buildingInfo[state]}
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

export default BuildingState;
