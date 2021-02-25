import React, { useRef } from 'react';
import LoadingAnimation from './LoadingAnimation';

const LoadingState = ({
    startNow,
    noLoad,
    initial,
    inProgress,
    success,
    error,
    notFound,
    errorFallback = 'An error occurred',
    notFoundFallback = 'Not found',
    children,
}) => {
    // the startNow prop indicates that loading has already started
    // the noLoad prop indicates that there is no async waiting state
    // _started is used internally to track deferred initial loading
    const _started = useRef(startNow || noLoad || null);

    // otherwise, we delay loading until the inProgress prop indicates loading has started
    // once loading initially starts, we toggle _started to begin rendering the success/error/notFound/loading states
    if (inProgress && _started.current === null) {
        _started.current = true;
    }

    let componentState = initial || null;

    // loading has not started yet
    // return initial state early
    if (!_started.current) {
        return componentState;

    // loading started and succeeded
    // return child elements/components
    } else if (success) {
        componentState = children;

    // loading started and an error occurred
    // return error fallback message/component
    } else if (error) {
        componentState = errorFallback;

    // loading started and data was not found
    // return not found fallback message/component
    } else if (notFound) {
        componentState = notFoundFallback;

    // loading started, but not completed yet
    // return a loading indicator
    } else if (!noLoad) {
        componentState = (<LoadingAnimation />);
    }

    return componentState;
};

export default LoadingState;
