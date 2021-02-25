import { combineReducers } from 'redux';
import {
    SET_USER,
    SET_INITIAL_USER,
    SET_SELECTED_RACE,
    SET_VISIBLE_STATE,
    SET_REPLAYS,
    SET_REPLAY_INFO,
    SET_STATS,
    SET_TRENDS,
    SET_WINRATE,
    SET_SELECTED_REPLAY_HASH,
    SET_FIXED_HOVER_STATE,
    LOGOUT_RESET,
} from './actions';

const races = ['protoss', 'terran', 'zerg'];
const raceDefaultState = {
    replays: null,
    stats: null,
    trends: null,
    winrate: null,
};
const raceDataDefaultState = {};

races.forEach((race) => {
    raceDataDefaultState[race] = raceDefaultState;
});

const user = (state = null, action) => {
    // checks if the state shape is fresh/loading from
    // localStorage or is being fetched from hook
    // then handles appropriately
    const handleStateShape = (currentState) => {
        // if snake case key exists, then fresh state
        // else hook fetching
        if (currentState && ('battlenet_accounts' in currentState)) {
            const { battlenet_accounts, main_race, ...userInfo } = currentState;
            return {
                ...userInfo,
                battlenetAccounts: battlenet_accounts,
                mainRace: main_race,
            };
        }
        return currentState;
    };

    switch (action.type) {
        case SET_USER:
        case SET_INITIAL_USER:
            return handleStateShape(action.user);

        case LOGOUT_RESET:
            return null;

        default:
            return handleStateShape(state);
    }
};

const selectedRace = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_RACE:
        case SET_INITIAL_USER:
            return action.selectedRace;

        case LOGOUT_RESET:
            return null;

        default:
            return state;
    }
};

const visibleState = (state = true, action) => {
    switch(action.type) {
        case SET_VISIBLE_STATE:
            return action.visibleState;

        default:
            return state;
    }
};

const raceData = (state = raceDataDefaultState, action) => {
    switch (action.type) {
        case SET_REPLAYS:
            Object.entries(action.data).forEach(([race, info]) => {
                info.stats = state[race].stats;
                info.trends = state[race].trends;
                info.winrate = state[race].winrate;
            });
            return { ...state, ...action.data };

        case SET_STATS:
            Object.entries(action.data).forEach(([race, info]) => {
                info.replays = state[race].replays;
                info.trends = state[race].trends;
                info.winrate = state[race].winrate;
            });
            return { ...state, ...action.data };

        case SET_TRENDS:
            Object.entries(action.data).forEach(([race, info]) => {
                info.replays = state[race].replays;
                info.stats = state[race].stats;
                info.winrate = state[race].winrate;
            });
            return { ...state, ...action.data };

        case SET_WINRATE:
            Object.entries(action.data).forEach(([race, info]) => {
                info.replays = state[race].replays;
                info.stats = state[race].stats;
                info.trends = state[race].trends;
            });
            return { ...state, ...action.data };

        case LOGOUT_RESET:
            return raceDataDefaultState;

        default:
            return state;
    }
};

const replayInfo = (state = null, action) => {
    switch (action.type) {
        case SET_REPLAY_INFO:
            return action.replayInfo;

        case LOGOUT_RESET:
            return null;

        default:
            return state;
    }
};

const selectedReplayHash = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_REPLAY_HASH:
            return action.replayHash;

        case LOGOUT_RESET:
            return null;

        default:
            return state;
    }
};

const isHoverStateFixed = (state = false, action) => {
    switch (action.type) {
        case SET_FIXED_HOVER_STATE:
            return action.hoverState;

        default:
            return state;
    }
};

const profileInfo = combineReducers({
    user,
    selectedRace,
    visibleState,
    raceData,
    replayInfo,
    selectedReplayHash,
    isHoverStateFixed,
});

export default profileInfo;
