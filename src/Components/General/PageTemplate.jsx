import { useState } from 'react';
import PageSidebar from './PageSidebar';
import './CSS/PageTemplate.css';

const PageTemplate = (props) => {
    const [visibleState, setVisibleState] = useState(true);

    return (
        <div
            className={`${props.section} PageTemplate`}
            style={visibleState ? {} : { gridTemplate: 'min-content 1fr / min-content 1fr 0' }}
        >
            <header className="PageTemplate__header">
                <h1 className="PageTemplate__title">
                    <div className="PageTemplate__logo">z</div>&nbsp;
                    ZEPHYRUS <span className="PageTemplate__beta-icon">BETA</span>
                </h1>
            </header>
            <PageSidebar
                section={props.section}
                noNav={props.noNav}
            />
            <section className="PageTemplate__main-content">
                {props.section === 'Replays' &&
                    <span className="PageTemplate__hide-wrapper">
                        {visibleState ? 'Hide Replays' : ''}
                        <button
                            className="PageTemplate__hide-side-bar"
                            onClick={() => (visibleState ? setVisibleState(false) : setVisibleState(true))}
                        >
                            <img
                                className="PageTemplate__hide-icon"
                                src="../../icons/hide-arrow.svg"
                                alt="hide-button"
                                style={visibleState ? {} : { transform: 'rotate(180deg)' }}
                            />
                        </button>
                    </span>}
                {props.mainContent}
            </section>

            {props.sideBar &&
                <section
                    className="PageTemplate__content-sidebar"
                    style={visibleState ?
                        {} : { display: 'none' }}
                >
                    {props.sideBar}
                </section>}
        </div>
    );
};

export default PageTemplate;
