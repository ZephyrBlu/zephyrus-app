import { Fragment } from 'react';

const TimelineState = (props) => {
    switch (props.type) {
        case 'unit':
            return (
                <Fragment>
                    <h2>Units</h2>
                    <div className="timeline-state__info timeline-state__info--live">
                        <div
                            key={`timeline-state__${props.type}-info-player${props.playerId}`}
                            className={`timeline-state__info-player${props.playerId}`}
                        >
                            {props.timelineState[props.type] &&
                                Object.entries(props.timelineState[props.type]).map(([name, info]) => (
                                    info.live > 0 &&
                                        <Fragment>
                                            <img
                                                alt={name}
                                                title={name}
                                                className="timeline-state__image"
                                                src={`./images/${props.type}/${props.playerRace}/${name}.jpg`}
                                            />
                                            <div className="timeline-state__object-count timeline-state__object-count--live">{info.live}</div>
                                        </Fragment>
                                ))}
                        </div>
                    </div>
                    <div className="timeline-state__info timeline-state__info--died">
                        <div
                            key={`timeline-state__${props.type}-info-player${props.playerId}`}
                            className={`timeline-state__info-player${props.playerId}`}
                        >
                            {props.timelineState[props.type] &&
                                Object.entries(props.timelineState[props.type]).map(([name, info]) => (
                                    info.died > 0 &&
                                        <Fragment>
                                            <img
                                                alt={name}
                                                title={name}
                                                className="timeline-state__image timeline-state__image--small"
                                                src={`./images/${props.type}/${props.playerRace}/${name}.jpg`}
                                            />
                                            <div className="timeline-state__object-count timeline-state__object-count--small timeline-state__object-count--died">{info.died}</div>
                                        </Fragment>
                                ))}
                        </div>
                    </div>
                </Fragment>
            );

        case 'building':
            return (
                <Fragment>
                    <h2>Buildings</h2>
                    <div className="timeline-state__info timeline-state__info--live">
                        <div
                            key={`timeline-state__${props.type}-info-player${props.playerId}`}
                            className={`timeline-state__info-player${props.playerId}`}
                        >
                            {props.timelineState[props.type] &&
                                Object.entries(props.timelineState[props.type]).map(([name, info]) => (
                                    info.live > 0 &&
                                        <Fragment>
                                            <img
                                                alt={name}
                                                title={name}
                                                className="timeline-state__image"
                                                src={`./images/${props.type}/${props.playerRace}/${name}.jpg`}
                                            />
                                            <div className="timeline-state__object-count">{info.live}</div>
                                        </Fragment>
                                ))}
                        </div>
                    </div>
                    <div className="timeline-state__info timeline-state__info--died">
                        <div
                            key={`timeline-state__${props.type}-info-player${props.playerId}`}
                            className={`timeline-state__info-player${props.playerId}`}
                        >
                            {props.timelineState[props.type] &&
                                Object.entries(props.timelineState[props.type]).map(([name, info]) => (
                                    info.died > 0 &&
                                        <Fragment>
                                            <img
                                                alt={name}
                                                title={name}
                                                className="timeline-state__image"
                                                src={`./images/${props.type}/${props.playerRace}/${name}.jpg`}
                                            />
                                            <div className="timeline-state__object-count">{info.died}</div>
                                        </Fragment>
                                ))}
                        </div>
                    </div>
                    <div className="timeline-state__info timeline-state__info--in-progress">
                        <div
                            key={`timeline-state__${props.type}-info-player${props.playerId}`}
                            className={`timeline-state__info-player${props.playerId}`}
                        >
                            {props.timelineState[props.type] &&
                                Object.entries(props.timelineState[props.type]).map(([name, info]) => (
                                    info.in_progress > 0 &&
                                        <Fragment>
                                            <img
                                                alt={name}
                                                title={name}
                                                className="timeline-state__image"
                                                src={`./images/${props.type}/${props.playerRace}/${name}.jpg`}
                                            />
                                            <div className="timeline-state__object-count">{info.in_progress}</div>
                                        </Fragment>
                                ))}
                        </div>
                    </div>
                </Fragment>
            );

        case 'upgrade':
            return null;

        default:
            return null;
    }
};

export default TimelineState;
