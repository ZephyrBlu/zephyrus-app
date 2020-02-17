import { combineReducers } from 'redux';
import {
    SET_USER,
    SET_DEFAULT_USER,
    SET_SELECTED_RACE,
    SET_REPLAYS,
    SET_REPLAY_INFO,
    SET_TRENDS,
    SET_REPLAY_COUNT,
    SET_SELECTED_REPLAY_HASH,
    SET_FIXED_HOVER_STATE,
} from './actions';

const races = ['protoss', 'terran', 'zerg'];
const raceDefaultState = { replays: null, trends: null, count: 0 };
const raceDataDefaultState = {};

races.forEach((race) => {
    raceDataDefaultState[race] = raceDefaultState;
});

const defaultUserState = {
    email: null,
    verified: false,
    battlenet_accounts: null,
    token: null,
    main_race: null,
};

const user = (state = defaultUserState, action) => {
    // checks if the state shape is fresh/loading from
    // localStorage or is being fetched from hook
    // then handles appropriately
    const handleStateShape = (currentState) => {
        // if snake case key exists, then fresh state
        // else hook fetching
        if ('battlenet_accounts' in currentState) {
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
            return handleStateShape(action.user);

        case SET_DEFAULT_USER:
            return defaultUserState;

        default:
            return handleStateShape(state);
    }
};

const selectedRace = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_RACE:
            return action.selectedRace;

        default:
            return state;
    }
};

const raceData = (state = raceDataDefaultState, action) => {
    switch (action.type) {
        case SET_REPLAYS:
            return {
                ...state,
                [action.race]: {
                    ...state[action.race],
                    replays: action.replays,
                },
            };

        case SET_TRENDS:
            return {
                ...state,
                [action.race]: {
                    ...state[action.race],
                    trends: action.trends,
                },
            };

        case SET_REPLAY_COUNT:
            return {
                ...state,
                [action.race]: {
                    ...state[action.race],
                    count: action.count,
                },
            };

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
    raceData,
    replayInfo,
    selectedReplayHash,
    isHoverStateFixed,
});

export default profileInfo;
