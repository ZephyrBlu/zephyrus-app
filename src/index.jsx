import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import profileInfo from './reducers';
import ProfileApp from './ProfileApp';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'https://849d1f1cb4b0468d9a2b6a7e5fb4f8cd@sentry.io/1554514' });
}

let urlPrefix;
if (process.env.NODE_ENV === 'production') {
    // urlPrefix = 'https://zephyrus.gg/';
    urlPrefix = 'https://testing-dot-reflected-codex-228006.uc.r.appspot.com/';
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
            <ProfileApp />
        </Provider>
    ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
    module.hot.accept('./ProfileApp', load);
}

load();
