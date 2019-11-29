import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setApiKey, setReplayList, setSelectedReplayHash } from '../../actions';
// import PageInfo from './PageInfo';
import PageNav from './PageNav';
import './CSS/PageSidebar.css';

// <PageInfo pageTitle={props.pageTitle} />
//         <h1 className="PageSidebar__page-title">{props.pageTitle}</h1>

const PageSidebar = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);
    const [hoverState, setHoverState] = useState(false);

    const handleLogout = async () => {
        let urlPrefix;
        if (process.env.NODE_ENV === 'development') {
            urlPrefix = 'http://127.0.0.1:8000/';
        } else {
            urlPrefix = 'https://zephyrus.gg/';
        }

        const url = `${urlPrefix}api/logout/`;

        const error = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then(response => (
            response.status === 200 ? null : `${response.status} ${response.statusText}`
        ));

        if (error) {
            alert('Something went wrong. Please try to logout again');
        }
        sessionStorage.clear();
        dispatch(setAuthToken(null));
        dispatch(setApiKey(null));
        dispatch(setReplayList([]));
        dispatch(setSelectedReplayHash(null));
    };

    return (
        !props.noNav &&
            <section className="PageSidebar">
                <PageNav
                    pages={['Overview', 'Replays', 'Analysis', 'Upload']}
                />
                <img
                    className="PageSidebar__settings-icon"
                    src="../../icons/settings.svg"
                    alt="settings"
                />
                <button
                    className="PageSidebar__logout"
                    onMouseEnter={() => setHoverState(true)}
                    onMouseLeave={() => setHoverState(false)}
                    onMouseMove={() => (hoverState ? null : setHoverState(true))}
                    onFocus={() => setHoverState(true)}
                    onBlur={() => setHoverState(false)}
                    onClick={() => handleLogout()}
                >
                    <img
                        className="PageSidebar__logout-icon"
                        src="../../icons/logout.svg"
                        alt="logout"
                    />
                    {hoverState && <span className="PageSidebar__logout-text">Logout</span>}
                </button>
            </section>
    );
};

export default PageSidebar;
