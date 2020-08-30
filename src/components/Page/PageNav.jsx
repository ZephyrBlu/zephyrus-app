import { Link } from '@reach/router';
import NavIcon from './NavIcon';
import './CSS/PageNav.css';

const PageNav = ({ pages, hoverState }) => {
    const isActive = ({ isCurrent }) => {
        if (isCurrent) {
            return { className: 'PageNav__link PageNav__link--active' };
        }
        return { className: 'PageNav__link' };
    };

    const hoverTimeouts = [];

    const createLinkStyle = (pageName) => {
        if (hoverState.fixed) {
            return {
                width: '140px',
                borderRadius: '27px',
            };
        }

        if (hoverState.state[pageName]) {
            return {
                width: '140px',
                borderRadius: '27px',
                backgroundColor: 'hsl(210, 70%, 16%)',
            };
        }
        return {};
    };

    return (
        <nav className="PageNav">
            <ul
                className="PageNav__link-list"
                onMouseLeave={() => {
                    if (!hoverState.fixed) {
                        hoverState.reset();
                    }

                    hoverTimeouts.forEach((timeout) => {
                        clearTimeout(timeout);
                    });
                }}
            >
                {pages.map((pageName) => {
                    let hoverTimeout;
                    hoverTimeouts.push(hoverTimeout);

                    return (
                        <li className="PageNav__link-wrapper" key={pageName}>
                            <Link
                                key={pageName}
                                getProps={isActive}
                                to={`/${pageName.toLowerCase()}`}
                                onMouseEnter={() => {
                                    if (!hoverState.fixed) {
                                        clearTimeout(hoverTimeout);

                                        hoverState.set(prevState => (
                                            { ...prevState, [pageName]: true }
                                        ));
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (!hoverState.fixed) {
                                        hoverTimeout = setTimeout(() => (
                                            hoverState.set(prevState => (
                                                { ...prevState, [pageName]: false }
                                            ))), 400);
                                    }
                                }}
                                onMouseMove={() => {
                                    if (!hoverState.fixed && !hoverState.state[pageName]) {
                                        hoverState.set(prevState => (
                                            { ...prevState, [pageName]: true }
                                        ));
                                    }
                                }}
                                style={createLinkStyle(pageName)}
                            >
                                <NavIcon
                                    icon={pageName.toLowerCase()}
                                    text={hoverState.state[pageName] ? pageName : false}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default PageNav;
