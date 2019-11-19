import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as Sentry from '@sentry/browser';
import profileInfo from './reducers';
import ProfileApp from './ProfileApp';

Sentry.init({ dsn: 'https://849d1f1cb4b0468d9a2b6a7e5fb4f8cd@sentry.io/1554514' });

const store = createStore(profileInfo, applyMiddleware(thunk));

const root = document.getElementById('root');
const load = () => render(
    (
        <Provider store={store}>
            <ProfileApp />
        </Provider>
    ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
    module.hot.accept('./ProfileApp', load);
}

load();
