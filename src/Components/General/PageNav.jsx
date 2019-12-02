import { Link } from '@reach/router';
import './CSS/PageNav.css';

const PageNav = (props) => {
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
                                // onMouseMove={() => (
                                //     hoverState[pageName] ?
                                //         null
                                //         :
                                //         setHoverState(prevState => (
                                //             { ...prevState, [pageName]: true }
                                //         ))
                                // )}
                                style={props.hoverState[pageName] ?
                                    { width: '100px', borderRadius: '27px' } : { width: '22px' }}
                            >
                                {props.hoverState[pageName] ? pageName : pageName.slice(0, 1)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default PageNav;
