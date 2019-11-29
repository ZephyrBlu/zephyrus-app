import { useState } from 'react';
import { Link } from '@reach/router';
import './CSS/PageNav.css';

const PageNav = (props) => {
    const initialHoverState = {};
    props.pages.forEach((pageName) => {
        initialHoverState[pageName] = false;
    });

    const [hoverState, setHoverState] = useState(initialHoverState);

    const isActive = ({ isCurrent }) => (
        isCurrent ?
            { className: 'PageNav__link PageNav__link--active' }
            :
            { className: 'PageNav__link' }
    );

    const hoverTimeouts = [];

    return (
        <nav className={`PageNav PageNav--${props.pages[0]}`}>
            <ul
                className="PageNav__link-list"
                onMouseLeave={() => {
                    setHoverState(initialHoverState);

                    hoverTimeouts.forEach((timeout) => {
                        clearTimeout(timeout);
                    });
                }}
            >
                {props.pages.map((pageName) => {
                    let hoverTimeout;
                    hoverTimeouts.push(hoverTimeout);

                    return (
                        <li className="PageNav__link-wrapper" key={pageName}>
                            <Link
                                key={pageName}
                                getProps={isActive}
                                to={`/${pageName.toLowerCase()}`}
                                onMouseEnter={() => {
                                    clearTimeout(hoverTimeout);

                                    setHoverState(prevState => (
                                        { ...prevState, [pageName]: true }
                                    ));
                                }}
                                onMouseLeave={() => {
                                    hoverTimeout = setTimeout(() =>
                                        setHoverState(prevState => (
                                            { ...prevState, [pageName]: false }
                                        )), 400);
                                }}
                                // onMouseMove={() => (
                                //     hoverState[pageName] ?
                                //         null
                                //         :
                                //         setHoverState(prevState => (
                                //             { ...prevState, [pageName]: true }
                                //         ))
                                // )}
                                style={hoverState[pageName] ?
                                    { width: '100px', borderRadius: '27px' } : { width: '22px' }}
                            >
                                {hoverState[pageName] ? pageName : pageName.slice(0, 1)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default PageNav;
