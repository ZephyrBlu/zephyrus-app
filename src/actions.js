export const userUpdated = 'userUpdated';
export const initialLogin = 'initialLogin';
export const raceSelected = 'raceSelected';
export const initialFetch = 'initialFetch';
export const replaysUpdated = 'replaysUpdated';
export const SET_REPLAY_INFO = 'SET_REPLAY_INFO';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';
export const userLogout = 'userLogout';

export const updateUser = user => (
    { type: userUpdated, user }
);

export const setInitialUser = (user, selectedRace) => (
    { type: initialLogin, user, selectedRace }
);

export const updateSelectedRace = selectedRace => (
    { type: raceSelected, selectedRace }
);

export const setInitialData = (data, field, race) => (
    { type: initialFetch, data, field, race }
);

export const updateReplays = (data, field, race) => (
    { type: replaysUpdated, data, field, race }
);

export const setReplayInfo = replayInfo => (
    { type: SET_REPLAY_INFO, replayInfo }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);

export const logoutReset = () => (
    { type: userLogout }
);
