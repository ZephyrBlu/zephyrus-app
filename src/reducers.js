import { combineReducers } from 'redux';
import {
    SET_AUTHENTICATION_TOKEN,
    SET_REPLAYS,
    SET_SELECTED_REPLAY_HASH,
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

const selectedReplayHash = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTED_REPLAY_HASH:
            return action.replayHash;

        default:
            return state;
    }
};

const profileInfo = combineReducers({
    token,
    replayList,
    selectedReplayHash,
});

export default profileInfo;
