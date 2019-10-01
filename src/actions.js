export const SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN';
export const SET_API_KEY = 'SET_API_KEY';
export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_REPLAY_INFO = 'SET_REPLAY_INFO';
export const SET_TRENDS = 'SET_TRENDS';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';
export const SET_BATTLENET_STATUS = 'SET_BATTLENET_STATUS';

export const setAuthToken = token => (
    { type: SET_AUTHENTICATION_TOKEN, token }
);

export const setApiKey = apiKey => (
    { type: SET_API_KEY, apiKey }
);

export const setReplayList = replayList => (
    { type: SET_REPLAYS, replayList }
);

export const setReplayInfo = replayInfo => (
    { type: SET_REPLAY_INFO, replayInfo }
);

export const setTrends = trends => (
    { type: SET_TRENDS, trends }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);

export const setBattlenetStatus = status => (
    { type: SET_BATTLENET_STATUS, status }
);
