import React, { useLayoutEffect, useState, Fragment } from 'react';
import './CSS/TimelineState.css';

const ObjectState = (props) => {
    const [unitLimit, setUnitLimit] = useState(10);

    if (Array.isArray(props.ignoreObjects)) {
        // ignoreObjects is an array
    } else {
        // is a dict
    }

    let unitsRendered = 0;

    useLayoutEffect(() => {
        const updateIconLimit = () => {
            const windowSize = window.innerWidth;
            if (props.visibleState) {
                if (windowSize < 1920) {
                    const iconDiff = Math.ceil((1920 - windowSize) / 120);
                    setUnitLimit(10 - iconDiff);
                } else {
                    setUnitLimit(10);
                }
            } else if (windowSize < 1920) {
                const iconDiff = Math.ceil((1920 - windowSize) / 160);
                setUnitLimit(12 - iconDiff);
            } else {
                setUnitLimit(12);
            }
        };
        window.addEventListener('resize', updateIconLimit);
        updateIconLimit();

        return () => {
            window.removeEventListener('resize', updateIconLimit);
        };
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

    const checkObjectState = (objectName, startIndex = false) => {
        // with start index, returns the name of the object without it's state
        // without start index it returns the object's state
        // if the object has no state it returns the unaltered name

        const terranFlyingBuildings = [
            'BarracksFlying',
            'FactoryFlying',
            'StarportFlying',
            'CommandCenterFlying',
            'OrbitalCommandFlying',
        ];

        if (objectName.includes('Burrowed')) {
            return (
                startIndex === 0
                    ? objectName.slice(startIndex, -8)
                    : objectName.slice(-8)
            );
        }

        if (objectName.includes('Flying')) {
            const isTerran = terranFlyingBuildings.includes(objectName);
            const flyingIndex = (isTerran && (startIndex === false)) ? -6 : null;

            if (flyingIndex) {
                return objectName.slice(flyingIndex);
            }

            return (
                startIndex === 0
                    ? objectName.slice(startIndex, -6)
                    : 'Morphing'
            );
        }

        if (objectName !== 'Egg' && objectName.includes('Egg')) {
            return (
                startIndex === 0
                    ? objectName.slice(startIndex, -3)
                    : objectName.slice(-6)
            );
        }

        if (objectName.includes('Cocoon')) {
            return (
                startIndex === 0
                    ? objectName.slice(startIndex, -6)
                    : 'Morphing'
            );
        }
        return objectName;
    };

    return (
        props.objectStates.map(state => (
            <div key={`${state}-div`} className={`timeline-state__info timeline-state__info--${state}`}>
                <h2 key={`${state}-title`} className="state-info-title">
                    {capitalize(props.objectType)}s&nbsp;
                    {state === 'in_progress' ? 'In-progress' : capitalize(state)}
                </h2>
                {props.playerOrder.map((playerId, index) => {
                    unitsRendered = 0;

                    return (
                        <div
                            key={`timeline-state__building-info-player${index + 1}`}
                            className={`timeline-state__info-player${index + 1}`}
                        >
                            {props.timelineState[playerId][props.objectType] &&
                                Object.entries(props.timelineState[playerId][props.objectType]).map(([objectName, objectInfo]) => (
                                    objectInfo[state] > 0 && !(props.ignoreObjects.includes(objectName)) &&
                                        <Fragment key={`${objectName}-${state}-frag`}>
                                            {insertBreak()}
                                            {objectName !== checkObjectState(objectName) &&
                                                <div
                                                    key={`${objectName}-state-div`}
                                                    className="timeline-state__object-label timeline-state__object-state"
                                                >
                                                    {checkObjectState(objectName)[0]}
                                                </div>}
                                            <img
                                                key={`${objectName}-${state}-img`}
                                                alt={objectName}
                                                title={objectName}
                                                className="timeline-state__image"
                                                src={`./images/${props.objectType}/${props.players[playerId].race}/${checkObjectState(objectName, 0)}.png`}
                                            />
                                            <div
                                                key={`${objectName}-${state}-div`}
                                                className={`timeline-state__object-label timeline-state__object-count timeline-state__object-count--${state}`}
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
