import { render } from 'react-dom';
import ProfileApp from './ProfileApp';

const root = document.getElementById('root');
const load = () => render(
    (
        <ProfileApp />
    ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
    module.hot.accept('./ProfileApp', load);
}

load();
