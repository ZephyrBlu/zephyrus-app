export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN';

export const setReplays = replayList => (
    { type: SET_REPLAYS, replayList }
);

export const setAuthToken = token => (
    { type: SET_AUTHENTICATION_TOKEN, token }
);
