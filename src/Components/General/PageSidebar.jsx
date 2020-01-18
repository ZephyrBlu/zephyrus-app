import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from '@reach/router';
import {
    setDefaultUser,
    setReplays,
    setSelectedReplayHash,
    setFixedHoverState,
} from '../../actions';
import PageNav from './PageNav';
import './CSS/PageSidebar.css';

const PageSidebar = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isHoverStateFixed = useSelector(state => state.isHoverStateFixed);

    const defaultHoverState = { Logout: false };
    props.pages.forEach((pageName) => {
        defaultHoverState[pageName] = false;
    });

    const fixedHoverState = { Logout: true };
    props.pages.forEach((pageName) => {
        fixedHoverState[pageName] = true;
    });

    const [hoverState, setHoverState] = useState(isHoverStateFixed ? fixedHoverState : defaultHoverState);

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
                Authorization: `Token ${user.token}`,
            },
        }).then(response => (
            response.status === 200 ? null : `${response.status} ${response.statusText}`
        ));

        if (error) {
            alert('Something went wrong. Please try to logout again');
        }
        localStorage.clear();
        dispatch(setDefaultUser());
        dispatch(setReplays([]));
        dispatch(setSelectedReplayHash(null));
    };

    const handleHoverStateReset = () => {
        setHoverState(defaultHoverState);
    };

    // const isActive = ({ isCurrent }) => {
    //     if (isCurrent) {
    //         return { className: 'PageSidebar__settings PageSidebar__settings--active' };
    //     }
    //     return { className: 'PageSidebar__settings' };
    // };

    // <Link
    //     getProps={isActive}
    //     to="/settings"
    //     style={isHoverStateFixed ? { margin: '0 auto 20px' } : {}}
    // >
    //     <img
    //         className="PageSidebar__settings-icon"
    //         src="../../icons/settings.svg"
    //         alt="settings"
    //     />
    // </Link>

    return (
        !props.noNav &&
            <section className="PageSidebar">
                <button
                    className="PageSidebar__show-hide"
                    onClick={() => {
                        if (isHoverStateFixed) {
                            dispatch(setFixedHoverState(false));
                            setHoverState(defaultHoverState);
                        } else {
                            dispatch(setFixedHoverState(true));
                            setHoverState(fixedHoverState);
                        }
                    }}
                    style={isHoverStateFixed ? { justifySelf: 'flex-end' } : {}}
                >
                    <img
                        className="PageSidebar__show-hide-icon"
                        src="../../icons/arrow-right.svg"
                        alt="show-hide-button"
                        style={isHoverStateFixed ? { transform: 'rotate(180deg)' } : {}}
                    />
                </button>
                <PageNav
                    pages={props.pages}
                    resetHoverState={handleHoverStateReset}
                    fixedHoverState={isHoverStateFixed}
                    hoverState={hoverState}
                    setHoverState={setHoverState}
                />
                <button
                    className="PageSidebar__logout"
                    onMouseEnter={() => setHoverState(prevState => ({ ...prevState, Logout: true }))}
                    onMouseLeave={() => (isHoverStateFixed ?
                        null : setHoverState(prevState => ({ ...prevState, Logout: false })))
                    }
                    // onMouseMove={() => (hoverState ? null : setHoverState(true))}
                    onFocus={() => setHoverState(prevState => ({ ...prevState, Logout: true }))}
                    onBlur={() => (isHoverStateFixed ?
                        null : setHoverState(prevState => ({ ...prevState, Logout: false })))
                    }
                    onClick={handleLogout}
                    style={hoverState.Logout ?
                        {
                            marginRight: '16px',
                            width: '130px',
                            borderRadius: '25px',
                        } : {}}
                >
                    <img
                        className="PageSidebar__logout-icon"
                        src="../../icons/logout.svg"
                        alt="logout"
                    />
                    {hoverState.Logout && <span className="PageSidebar__logout-text">Logout</span>}
                </button>
            </section>
    );
};

export default PageSidebar;
