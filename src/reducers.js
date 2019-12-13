import { combineReducers } from 'redux';
import {
    SET_AUTHENTICATION_TOKEN,
    SET_SELECTED_RACE,
    SET_REPLAYS,
    SET_REPLAY_INFO,
    SET_TRENDS,
    SET_SELECTED_REPLAY_HASH,
    SET_BATTLENET_STATUS,
    SET_FIXED_HOVER_STATE,
} from './actions';

const races = ['protoss', 'terran', 'zerg', 'null'];
const raceDefaultState = { replays: null, trends: null };
const raceDataDefaultState = {};

races.forEach((race) => {
    raceDataDefaultState[race] = raceDefaultState;
});

const token = (state = null, action) => {
    switch (action.type) {
        case SET_AUTHENTICATION_TOKEN:
            return action.token;

        default:
            return state;
    }
};

const selectedRace = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_RACE:
            return action.currentRace;

        default:
            return state;
    }
};

const raceData = (state = raceDataDefaultState, action) => {
    switch (action.type) {
        case SET_REPLAYS:
            if (races.includes(action.race)) {
                return {
                    ...state,
                    [action.race]: {
                        ...state[action.race],
                        replays: action.replays,
                    },
                };
            }
            return state;

        case SET_TRENDS:
            if (races.includes(action.race)) {
                return {
                    ...state,
                    [action.race]: {
                        ...state[action.race],
                        trends: action.trends,
                    },
                };
            }
            return state;

        default:
            return state;
    }
};

const replayInfo = (state = [], action) => {
    switch (action.type) {
        case SET_REPLAY_INFO:
            return action.replayInfo;

        default:
            return state;
    }
};

const selectedReplayHash = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_REPLAY_HASH:
            return action.replayHash;

        default:
            return state;
    }
};

const battlenetStatus = (state = null, action) => {
    switch (action.type) {
        case SET_BATTLENET_STATUS:
            return action.status;

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
    token,
    raceData,
    selectedRace,
    replayInfo,
    selectedReplayHash,
    battlenetStatus,
    isHoverStateFixed,
});

export default profileInfo;
