import { Fragment } from 'react';

const CurrentSelectionState = (props) => {
    const ignoreUnits = ['LocustMP', 'BroodlingEscort'];
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
            <br key={unitsRendered} /> : null;
        unitsRendered += 1;

        return isBreak;
    };

    const checkType = (playerId, objectName) => {
        if (Object.keys(props.timelineState[playerId].unit).indexOf(objectName) > -1) {
            return 'unit';
        }
        return 'building';
    };

    return (
        <div className="timeline-state__info timeline-state__info--current-selection">
            <h2 className="state-info-title">Current Selection</h2>
            {Object.keys(props.timelineState).map((playerId) => {
                unitsRendered = 0;

                return (
                    <div
                        key={`timeline-state__unit-info-player${playerId}`}
                        className={`timeline-state__info-player${playerId}`}
                    >
                        {props.timelineState[playerId].current_selection &&
                            Object.entries(props.timelineState[playerId].current_selection).map(([objectName, objectCount]) => (
                                !(ignoreUnits.includes(objectName)) && !(ignoreBuildings.includes(objectName)) &&
                                    <Fragment key={`${objectName}-${playerId}-frag`}>
                                        {insertBreak()}
                                        <img
                                            key={`${objectName}-${playerId}-img`}
                                            alt={objectName}
                                            title={objectName}
                                            className="timeline-state__image"
                                            src={`./images/${checkType(playerId, objectName)}/${props.players[playerId].race}/${objectName}.png`}
                                        />
                                        <div
                                            key={`${objectName}-${playerId}-div`}
                                            className="timeline-state__object-count"
                                        >
                                            {objectCount}
                                        </div>
                                    </Fragment>
                            ))}
                    </div>
                );
            })}
        </div>
    );
};

export default CurrentSelectionState;
