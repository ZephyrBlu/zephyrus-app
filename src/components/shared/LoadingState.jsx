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
    // the started prop indicates that loading has already started
    // _started is used internally to track deferred initial loading
    const _started = useRef(startNow || noLoad || null);

    // otherwise, we delay loading until the inProgress prop indicates loading has started
    // once loading initially starts, we toggle _started to begin rendering the success/error/notFound/loading states
    if (inProgress && _started.current === null) {
        _started.current = true;
    }

    let componentState = initial || null;
    // loading started and succeeded
    if (_started.current && success) {
        componentState = children;
    // loading started and errored out
    } else if (_started.current && error) {
        componentState = errorFallback;
    // loading started and data was not found
    } else if (_started.current && notFound) {
        componentState = notFoundFallback;
    // loading started, but not completed yet
    } else if (_started.current && !noLoad) {
        componentState = (<LoadingAnimation />);
    }
    return componentState;
};

export default LoadingState;
