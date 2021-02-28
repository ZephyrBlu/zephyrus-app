import React, { useState, useMemo } from 'react';
import { Link } from '@reach/router';
import PageNav from './PageNav';
import './CSS/PageSidebar.css';

const PageSidebar = ({ pages, handleLogout }) => {
    // minor optimization
    // only generate default states once and memoize the result
    const [defaultHoverState, fixedHoverState] = useMemo(() => {
        const _defaultHoverState = { Logout: false };
        const _fixedHoverState = { Logout: true };
        Object.keys(pages).forEach((pageName) => {
            _defaultHoverState[pageName] = false;
            _fixedHoverState[pageName] = true;
        });
        return [_defaultHoverState, _fixedHoverState];
    }, []);
    const [isHoverStateFixed, setIsHoverStateFixed] = useState(false);
    const [hoverState, setHoverState] = useState(isHoverStateFixed ? fixedHoverState : defaultHoverState);

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
                        setIsHoverStateFixed(false);
                        setHoverState(defaultHoverState);
                    } else {
                        setIsHoverStateFixed(true);
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
                pages={pages}
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
                onMouseLeave={() => (isHoverStateFixed
                    ? null
                    : setHoverState(prevState => ({ ...prevState, Logout: false })))}
                onFocus={() => setHoverState(prevState => ({ ...prevState, Logout: true }))}
                onBlur={() => (isHoverStateFixed
                    ? null
                    : setHoverState(prevState => ({ ...prevState, Logout: false })))}
                onClick={handleLogout}
                style={hoverState.Logout
                    ? {
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
