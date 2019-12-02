import { useState, Fragment } from 'react';
import PageSidebar from './PageSidebar';
import './CSS/PageTemplate.css';

const PageTemplate = (props) => {
    const [visibleState, setVisibleState] = useState(true);
    const [selectedRace, setSelectedRace] = useState('Protoss');

    const raceToggleStyle = {
        Protoss: { marginLeft: '5px' },
        Zerg: { marginLeft: '61px' },
        Terran: { marginLeft: '117px' },
    };

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
                {props.section !== 'Login' &&
                    <Fragment>
                        <div className="PageTemplate__page-info">
                            <h1 className="PageTemplate__page-name">
                                {props.pageTitle}
                            </h1>
                            <h2 className="PageTemplate__data-info">
                                {selectedRace}
                            </h2>
                        </div>
                        <div className="PageTemplate__race-toggle">
                            <div
                                className="PageTemplate__toggle-indicator"
                                style={raceToggleStyle[selectedRace]}
                            />
                            <button
                                className="PageTemplate__toggle-button"
                                onClick={() => {
                                    setSelectedRace('Protoss');
                                }}
                            >
                                <img
                                    src="../../icons/protoss-logo.svg"
                                    alt="Protoss"
                                    className="PageTemplate__race-icon"
                                />
                            </button>
                            <button
                                className="PageTemplate__toggle-button"
                                onClick={() => {
                                    setSelectedRace('Zerg');
                                }}
                            >
                                <img
                                    src="../../icons/zerg-logo.svg"
                                    alt="Zerg"
                                    className="PageTemplate__race-icon"
                                />
                            </button>
                            <button
                                className="PageTemplate__toggle-button"
                                onClick={() => {
                                    setSelectedRace('Terran');
                                }}
                            >
                                <img
                                    src="../../icons/terran-logo.svg"
                                    alt="Terran"
                                    className="PageTemplate__race-icon"
                                />
                            </button>
                        </div>
                    </Fragment>}
                {props.section === 'Replays' &&
                    <span className="PageTemplate__hide-wrapper">
                        {visibleState ? 'Hide Replays' : ''}
                        <button
                            className="PageTemplate__hide-side-bar"
                            onClick={() => (visibleState ? setVisibleState(false) : setVisibleState(true))}
                        >
                            <img
                                className="PageTemplate__hide-icon"
                                src="../../icons/arrow-right.svg"
                                alt="hide-button"
                                style={visibleState ? {} : { transform: 'rotate(180deg)' }}
                            />
                        </button>
                    </span>}
            </header>
            <PageSidebar
                section={props.section}
                noNav={props.noNav}
            />
            <section className="PageTemplate__main-content">
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
