export const SET_USER = 'SET_USER';
export const SET_DEFAULT_USER = 'SET_DEFAULT_USER';
export const SET_SELECTED_RACE = 'SET_SELECTED_RACE';
export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_REPLAY_INFO = 'SET_REPLAY_INFO';
export const SET_TRENDS = 'SET_TRENDS';
export const SET_REPLAY_COUNT = 'SET_REPLAY_COUNT';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';
export const SET_FIXED_HOVER_STATE = 'SET_FIXED_HOVER_STATE';

export const setUser = user => (
    { type: SET_USER, user }
);

export const setDefaultUser = user => (
    { type: SET_DEFAULT_USER, user }
);

export const setSelectedRace = selectedRace => (
    { type: SET_SELECTED_RACE, selectedRace }
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

export const setReplayCount = (count, race) => (
    { type: SET_REPLAY_COUNT, count, race }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);

export const setFixedHoverState = hoverState => (
    { type: SET_FIXED_HOVER_STATE, hoverState }
);
