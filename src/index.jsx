import { createContext } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import profileInfo from './reducers';
import { setInitialUser } from './actions';
import App from './App';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'https://849d1f1cb4b0468d9a2b6a7e5fb4f8cd@sentry.io/1554514' });
}

let urlPrefix;
if (process.env.NODE_ENV === 'production') {
    urlPrefix = 'https://zephyrus.gg/';
} else {
    urlPrefix = 'http://127.0.0.1:8000/';
}
const UrlContext = createContext();

const store = createStore(profileInfo);

if (localStorage.user) {
    const localUser = JSON.parse(localStorage.user);
    store.dispatch(setInitialUser(localUser, localUser.main_race));
}

const root = document.getElementById('root');
const load = () => render(
    (
        <Provider store={store}>
            <UrlContext.Provider value={urlPrefix}>
                <App />
            </UrlContext.Provider>
        </Provider>
    ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
    module.hot.accept('./App', load);
}

export default UrlContext;

load();
