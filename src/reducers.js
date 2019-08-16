import { combineReducers } from 'redux';
import { SET_REPLAYS, SET_AUTHENTICATION_TOKEN } from './actions';

const initialState = {
    replayList: [],
    token: null,
};

const replayList = (state = initialState.replayList, action) => {
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

const token = (state = initialState.token, action) => {
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
