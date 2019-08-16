import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import profileInfo from './reducers';
import ProfileApp from './ProfileApp';

const store = createStore(profileInfo);

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
