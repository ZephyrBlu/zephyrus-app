export const SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN';
export const SET_SELECTED_RACE = 'SET_SELECTED_RACE';
export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_REPLAY_INFO = 'SET_REPLAY_INFO';
export const SET_TRENDS = 'SET_TRENDS';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';
export const SET_BATTLENET_STATUS = 'SET_BATTLENET_STATUS';
export const SET_FIXED_HOVER_STATE = 'SET_FIXED_HOVER_STATE';

export const setAuthToken = token => (
    { type: SET_AUTHENTICATION_TOKEN, token }
);

export const setSelectedRace = currentRace => (
    { type: SET_SELECTED_RACE, currentRace }
);

export const setReplays = (replays, race) => (
    { type: SET_REPLAYS, replays, race }
);

export const setReplayInfo = replayInfo => (
    { type: SET_REPLAY_INFO, replayInfo }
);

export const setTrends = (trends, race) => (
    { type: SET_TRENDS, trends, race }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);

export const setBattlenetStatus = status => (
    { type: SET_BATTLENET_STATUS, status }
);

export const setFixedHoverState = hoverState => (
    { type: SET_FIXED_HOVER_STATE, hoverState }
);
