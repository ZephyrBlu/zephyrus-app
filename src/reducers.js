import { combineReducers } from 'redux';
import {
    SET_AUTHENTICATION_TOKEN,
    SET_REPLAYS,
    SET_REPLAY_INFO,
    SET_TRENDS,
    SET_SELECTED_REPLAY_HASH,
    SET_BATTLENET_STATUS,
} from './actions';

const token = (state = null, action) => {
    switch (action.type) {
        case SET_AUTHENTICATION_TOKEN:
            return action.token;

        default:
            return state;
    }
};

const replayList = (state = [], action) => {
    switch (action.type) {
        case SET_REPLAYS:
            return [
                ...state,
                ...action.replayList,
            ];

        default:
            return state;
    }
};

const replayInfo = (state = [], action) => {
    switch (action.type) {
        case SET_REPLAY_INFO:
            return [
                ...state,
                ...action.replayInfo,
            ];

        default:
            return state;
    }
};

const trends = (state = null, action) => {
    switch (action.type) {
        case SET_TRENDS:
            if (action.trends) {
                return { ...action.trends };
            }
            return action.trends;

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

const profileInfo = combineReducers({
    token,
    replayList,
    replayInfo,
    trends,
    selectedReplayHash,
    battlenetStatus,
});

export default profileInfo;
