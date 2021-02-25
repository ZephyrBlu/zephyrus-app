import React, { useState } from 'react';

const useNewLoadingState = () => {
    const [loadingState, _setLoadingState] = useState(null);
    const allowedStates = [
        'inProgress',
        'success',
        'error',
        'notFound',
    ];

    const setLoadingState = (state) => {
        if (!allowedStates.includes(state)) {
            throw `${state} is an undefined loading state`;
        }
        _setLoadingState({ [state]: true });
    };

    return [
        loadingState,
        setLoadingState,
    ];
};

export default useNewLoadingState;
