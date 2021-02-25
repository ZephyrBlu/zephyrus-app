import React, { useRef } from 'react';
import LoadingAnimation from './LoadingAnimation';

const LoadingState = ({
    defer,
    noLoad,
    spinner,
    state,
    initial,
    inProgress,
    success,
    error,
    notFound,
    errorFallback = 'An error occurred',
    notFoundFallback = 'Not found',
    children,
}) => {
    // the startNow prop indicates that we are current waiting for loading to begin
    // the noLoad prop indicates that there is no async waiting state
    // _started is used internally to track startNowred initial loading
    const _started = useRef(!defer || noLoad || null);

    // re-assign props if we're using hooks to declaratively manipulate state
    // instead of using data flow
    if (state !== null) {
        ({
            inProgress,
            success,
            error,
            notFound,
        } = {
            inProgress,
            success,
            error,
            notFound,
            ...state,
        });
    }

    // we delay loading until the inProgress prop indicates loading has started
    // once loading initially starts, we toggle _started to begin rendering the success/error/notFound/loading states
    if (inProgress && _started.current === null) {
        _started.current = true;
    }

    let componentState = initial || null;

    // loading has not started yet
    // return initial state early
    if (!_started.current) {
        return componentState;
    }

    // loading started and succeeded
    // return child elements/components
    if (success) {
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
        componentState = (spinner || spinner === null)
            ? spinner
            : (<LoadingAnimation />);
    }

    return componentState;
};

export default LoadingState;
