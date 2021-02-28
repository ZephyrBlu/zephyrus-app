export const SET_USER = 'SET_USER';
export const SET_INITIAL_USER = 'SET_INITIAL_USER';
export const SET_SELECTED_RACE = 'SET_SELECTED_RACE';
export const SET_VISIBLE_STATE = 'SET_VISIBLE_STATE';
export const SET_REPLAYS = 'SET_REPLAYS';
export const SET_STATS = 'SET_STATS';
export const SET_TRENDS = 'SET_TRENDS';
export const SET_WINRATE = 'SET_WINRATE';
export const SET_REPLAY_INFO = 'SET_REPLAY_INFO';
export const SET_SELECTED_REPLAY_HASH = 'SET_SELECTED_REPLAY_HASH';
export const LOGOUT_RESET = 'LOGOUT_RESET';

export const setUser = user => (
    { type: SET_USER, user }
);

export const setInitialUser = (user, selectedRace) => (
    { type: SET_INITIAL_USER, user, selectedRace }
);

export const setSelectedRace = selectedRace => (
    { type: SET_SELECTED_RACE, selectedRace }
);

export const setVisibleState = visibleState => (
    { type: SET_VISIBLE_STATE, visibleState }
);

export const setReplays = data => (
    { type: SET_REPLAYS, data }
);

export const setStats = data => (
    { type: SET_STATS, data }
);

export const setTrends = data => (
    { type: SET_TRENDS, data }
);

export const setWinrate = data => (
    { type: SET_WINRATE, data }
);

export const setReplayInfo = replayInfo => (
    { type: SET_REPLAY_INFO, replayInfo }
);

export const setSelectedReplayHash = replayHash => (
    { type: SET_SELECTED_REPLAY_HASH, replayHash }
);

export const logoutReset = () => (
    { type: LOGOUT_RESET }
);
