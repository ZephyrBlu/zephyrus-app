export const SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN';
export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';

export const setAuthToken = token => (
    { type: SET_AUTHENTICATION_TOKEN, token }
);

export const setReplays = replayList => (
    { type: SET_REPLAYS, replayList }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);
