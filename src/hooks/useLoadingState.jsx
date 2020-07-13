import { useRef, useCallback } from 'react';

const useLoadingState = (currentState, returnValues) => {
    const _state = useRef(currentState);
    const _returnValues = useRef(returnValues);

    // updating ref if something has changed
    if (_state.current !== currentState) {
        _state.current = currentState;
    }

    // memoized with useCallback to prevent the component from being re-rendered during execution
    const LoadingStateComponent = useCallback(({ specifiedState = null }) => {
        // checking if the template is a function (I.e. has dynamic data)
        // and needs to be executed to generate the output HTML
        const generateRenderData = (state, stored) => (
            typeof stored === 'function' ? stored(state) : stored
        );

        const returnData = _returnValues.current[_state.current.loadingState];
        let renderData;

        // if a particular state is specified, the current state must match it
        // otherwise we render nothing
        if (specifiedState) {
            // lists of states are supported as well
            // so we need to wrap singular values in an array
            if (typeof specifiedState === 'string') {
                specifiedState = [specifiedState];
            }

            // check if the current loading state is supported, otherwise render nothing
            renderData = specifiedState.includes(_state.current.loadingState)
                ? generateRenderData(_state.current.data, returnData)
                : null;
        } else {
            renderData = generateRenderData(_state.current.data, returnData);
        }

        return (
            renderData
        );
    }, []);

    return LoadingStateComponent;
};

export default useLoadingState;
