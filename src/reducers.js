import { combineReducers } from 'redux';
import {
    userUpdated,
    initialLogin,
    raceSelected,
    initialFetch,
    replaysUpdated,
    SET_REPLAY_INFO,
    SET_SELECTED_REPLAY_HASH,
    userLogout,
} from './actions';
import { RACES_LOWER } from './constants';

const defaultRaceState = {};
RACES_LOWER.forEach((race) => {
    defaultRaceState[race] = null;
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
        case userUpdated:
        case initialLogin:
            return handleStateShape(action.user);

        case userLogout:
            return null;

        default:
            return handleStateShape(state);
    }
};

const selectedRace = (state = null, action) => {
    switch (action.type) {
        case raceSelected:
        case initialLogin:
            return action.selectedRace;

        case userLogout:
            return null;

        default:
            return state;
    }
};

const replays = (state = defaultRaceState, action) => {
    switch (action.type) {
        case initialFetch:
            if (action.field !== 'replays') {
                return state;
            }

            if (action.race) {
                return { ...state, [action.race]: action.data };
            }

            return action.data;

        case replaysUpdated:
            if (action.race) {
                return { ...state, [action.race]: action.data };
            }
            return action.data;

        case userLogout:
            return defaultRaceState;

        default:
            return state;
    }
};

const winrate = (state = defaultRaceState, action) => {
    switch (action.type) {
        case initialFetch:
            if (action.field !== 'winrate') {
                return state;
            }

            if (action.race) {
                return { ...state, [action.race]: action.data };
            }

            return action.data;

        case userLogout:
            return defaultRaceState;

        default:
            return state;
    }
};

const stats = (state = defaultRaceState, action) => {
    switch (action.type) {
        case initialFetch:
            if (action.field !== 'stats') {
                return state;
            }

            if (action.race) {
                return { ...state, [action.race]: action.data };
            }

            return action.data;

        case userLogout:
            return defaultRaceState;

        default:
            return state;
    }
};

const trends = (state = defaultRaceState, action) => {
    switch (action.type) {
        case initialFetch:
            if (action.field !== 'trends') {
                return state;
            }

            if (action.race) {
                return { ...state, [action.race]: action.data };
            }

            return action.data;

        case userLogout:
            return defaultRaceState;

        default:
            return state;
    }
};

const replayInfo = (state = null, action) => {
    switch (action.type) {
        case SET_REPLAY_INFO:
            return action.replayInfo;

        case userLogout:
            return null;

        default:
            return state;
    }
};

const selectedReplayHash = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_REPLAY_HASH:
            return action.replayHash;

        case userLogout:
            return null;

        default:
            return state;
    }
};

const profileInfo = combineReducers({
    user,
    selectedRace,
    replays,
    winrate,
    stats,
    trends,
    replayInfo,
    selectedReplayHash,
});

export default profileInfo;
