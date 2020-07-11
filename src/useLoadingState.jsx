import { useRef, useCallback } from 'react';

const useLoadingState = (currentState, returnValues) => {
    const _state = useRef(currentState);
    const _returnValues = useRef(returnValues);

    if (_state.current.loadingState !== currentState.loadingState) {
        _state.current = currentState;
    }

    const LoadingStateComponent = useCallback(({ specifiedState = null }) => {
        const generateRenderData = (state, stored) => (
            typeof stored === 'function' ? stored(state) : stored
        );

        const returnData = _returnValues.current[_state.current.loadingState];
        let renderData;

        if (specifiedState) {
            renderData = _state.current.loadingState === specifiedState
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
