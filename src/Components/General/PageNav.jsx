import { Link } from '@reach/router';
import NavIcon from './NavIcon';
import './CSS/PageNav.css';

const PageNav = (props) => {
    const isActive = ({ isCurrent }) => {
        if (isCurrent) {
            return { className: 'PageNav__link PageNav__link--active' };
        }
        return { className: 'PageNav__link' };
    };

    const hoverTimeouts = [];

    const createLinkStyle = (pageName) => {
        if (props.fixedHoverState) {
            return {
                width: '100px',
                borderRadius: '27px',
            };
        } else if (props.hoverState[pageName]) {
            return {
                width: '100px',
                borderRadius: '27px',
                backgroundColor: 'hsl(209, 77%, 14%)',
            };
        }
        return {};
    };

    return (
        <nav className="PageNav">
            <ul
                className="PageNav__link-list"
                onMouseLeave={() => {
                    if (!props.fixedHoverState) {
                        props.resetHoverState();
                    }

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
                                    if (!props.fixedHoverState) {
                                        clearTimeout(hoverTimeout);

                                        props.setHoverState(prevState => (
                                            { ...prevState, [pageName]: true }
                                        ));
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (!props.fixedHoverState) {
                                        hoverTimeout = setTimeout(() =>
                                            props.setHoverState(prevState => (
                                                { ...prevState, [pageName]: false }
                                            )), 400);
                                    }
                                }}
                                onMouseMove={() => {
                                    if (!props.fixedHoverState && !props.hoverState[pageName]) {
                                        props.setHoverState(prevState => (
                                            { ...prevState, [pageName]: true }
                                        ));
                                    }
                                }}
                                style={createLinkStyle(pageName)}
                            >
                                <NavIcon
                                    icon={pageName.toLowerCase()}
                                    text={props.hoverState[pageName] ? pageName : false}
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
