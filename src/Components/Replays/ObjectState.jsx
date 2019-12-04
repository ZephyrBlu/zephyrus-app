import { useEffect, useState, Fragment } from 'react';
import './CSS/TimelineState.css';

const ObjectState = (props) => {
    const [unitLimit, setUnitLimit] = useState(10);

    if (Array.isArray(props.ignoreObjects)) {
        // ignoreObjects is an array
    } else {
        // is a dict
    }

    let unitsRendered = 0;
    const windowSize = window.innerWidth;

    useEffect(() => {
        if (props.visibleState) {
            if (windowSize <= 1400) {
                setUnitLimit(6);
            } else if (windowSize <= 1500) {
                setUnitLimit(7);
            } else if (windowSize <= 1700) {
                setUnitLimit(8);
            } else {
                setUnitLimit(10);
            }
        } else {
            setUnitLimit(14);
        }
    }, [props.visibleState]);

    const capitalize = str => (
        str.charAt(0).toUpperCase() + str.slice(1)
    );

    const insertBreak = () => {
        let isBreak;

        if (unitsRendered >= unitLimit && unitsRendered % unitLimit === 0) {
            isBreak = <br />;
        } else {
            isBreak = null;
        }
        unitsRendered += 1;

        return isBreak;
    };

    // const checkType = (playerId, objectName) => {
    //     if (Object.keys(props.timelineState[playerId].unit).indexOf(objectName) > -1) {
    //         return 'unit';
    //     }
    //     return 'building';
    // };

    return (
        props.objectStates.map(state => (
            <div key={`${state}-div`} className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 key={`${state}-title`} className="state-info-title">
                    {capitalize(props.objectType)}&nbsp;
                    {state === 'in_progress' ? 'In-progress' : capitalize(state)}
                </h2>
                {Object.keys(props.timelineState).map((playerId) => {
                    unitsRendered = 0;

                    return (
                        <div
                            key={`timeline-state__building-info-player${playerId}`}
                            className={`timeline-state__info-player${playerId}`}
                        >
                            {props.timelineState[playerId][props.objectType] &&
                                Object.entries(props.timelineState[playerId][props.objectType]).map(([objectName, objectInfo]) => (
                                    objectInfo[state] > 0 && !(props.ignoreObjects.includes(objectName)) &&
                                        <Fragment key={`${objectName}-${state}-frag`}>
                                            {insertBreak()}
                                            <img
                                                key={`${objectName}-${state}-img`}
                                                alt={objectName}
                                                title={objectName}
                                                className="timeline-state__image"
                                                src={`./images/${props.objectType}/${props.players[playerId].race}/${objectName}.jpg`}
                                            />
                                            <div
                                                key={`${objectName}-${state}-div`}
                                                className={`timeline-state__object-count timeline-state__object-count--${state}`}
                                            >
                                                {objectInfo[state]}
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

export default ObjectState;
