import { combineReducers } from 'redux';
import { SET_REPLAYS, SET_AUTHENTICATION_TOKEN } from './actions';

const replayList = (state = [], action) => {
    switch (action.type) {
        case SET_REPLAYS:
            return {
                ...state,
                replayList: [
                    ...action.replayList,
                ],
            };

        default:
            return state;
    }
};

const token = (state = null, action) => {
    switch (action.type) {
        case SET_AUTHENTICATION_TOKEN:
            return action.token;

        default:
            return state;
    }
};

const profileInfo = combineReducers({
    replayList,
    token,
});

export default profileInfo;
