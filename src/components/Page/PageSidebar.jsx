import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@reach/router';
import {
    logoutReset,
    setFixedHoverState,
} from '../../actions';
import UrlContext from '../../index';
import { handleFetch } from '../../utils';
import PageNav from './PageNav';
import { PAGES } from '../../constants';
import './CSS/PageSidebar.css';

const PageSidebar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isHoverStateFixed = useSelector(state => state.isHoverStateFixed);
    const urlPrefix = useContext(UrlContext);

    const defaultHoverState = { Logout: false };
    const fixedHoverState = { Logout: true };
    Object.keys(PAGES).forEach((pageName) => {
        defaultHoverState[pageName] = false;
        fixedHoverState[pageName] = true;
    });
    const [hoverState, setHoverState] = useState(isHoverStateFixed ? fixedHoverState : defaultHoverState);

    // can't extract into utils because of useDispatch hook
    const handleLogout = () => {
        const url = `${urlPrefix}api/logout/`;
        const opts = {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        };

        handleFetch(url, opts);
        localStorage.clear();
        dispatch(logoutReset());
    };

    const handleHoverStateReset = () => {
        setHoverState(defaultHoverState);
    };

    const isActive = ({ isCurrent }) => {
        if (isCurrent) {
            return { className: 'PageSidebar__settings PageSidebar__settings--active' };
        }
        return { className: 'PageSidebar__settings' };
    };

    return (
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
                hoverState={{
                    state: hoverState,
                    fixed: isHoverStateFixed,
                    set: setHoverState,
                    reset: handleHoverStateReset,
                }}
            />
            <Link
                getProps={isActive}
                to="/settings"
                style={isHoverStateFixed ? { margin: '0 auto 10px' } : {}}
            >
                <img
                    className="PageSidebar__settings-icon"
                    src="../../icons/settings.svg"
                    alt="settings"
                />
            </Link>
            <button
                className="PageSidebar__logout"
                onMouseEnter={() => setHoverState(prevState => ({ ...prevState, Logout: true }))}
                onMouseLeave={() => (isHoverStateFixed ?
                    null : setHoverState(prevState => ({ ...prevState, Logout: false })))}
                // onMouseMove={() => (hoverState ? null : setHoverState(true))}
                onFocus={() => setHoverState(prevState => ({ ...prevState, Logout: true }))}
                onBlur={() => (isHoverStateFixed ?
                    null : setHoverState(prevState => ({ ...prevState, Logout: false })))}
                onClick={handleLogout}
                style={hoverState.Logout ?
                    {
                        marginRight: '11px',
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
