import { Fragment } from 'react';
import ProfileSection from '../General/ProfileSection';
import StatBlock from './StatBlock';
import './CSS/Overview.css';

const Overview = (props) => {
    const pageTitle = 'Profile Overview';

    const mainContent = (
        <Fragment>
            <section className="summary-stats">
                <StatBlock
                    title="Recent"
                />
                <StatBlock />
            </section>

            <section className="analysis-stats">
                <div className="analysis-stats__stat-type">
                    <div className="analysis-stats__content">
                        <h1 className="analysis-stats__title">Strengths</h1>
                        <StatBlock
                            title="Protoss"
                            statName="Avg Winrate"
                        />
                        <StatBlock
                            title="Zerg"
                            statName="Avg Winrate"
                        />
                        <StatBlock
                            title="Terran"
                            statName="Avg Winrate"
                        />
                    </div>
                    <div className="analysis-stats__chart">Chart goes here</div>
                </div>

                <div className="analysis-stats__stat-type">
                    <div className="analysis-stats__content">
                        <h1 className="analysis-stats__title">Weaknesses</h1>
                        <StatBlock
                            title="Protoss"
                            statName="Avg Winrate"
                        />
                        <StatBlock
                            title="Zerg"
                            statName="Avg Winrate"
                        />
                        <StatBlock
                            title="Terran"
                            statName="Avg Winrate"
                        />
                    </div>
                    <div className="analysis-stats__chart">Chart goes here</div>
                </div>
            </section>
        </Fragment>
    );

    const sideBar = (
        <div className="map-winrate">
            <StatBlock
                statName="Map Name"
            />
            <StatBlock
                statName="Map Name"
            />
            <StatBlock
                statName="Map Name"
            />
            <StatBlock
                statName="Map Name"
            />
            <StatBlock
                statName="Map Name"
            />
            <StatBlock
                statName="Map Name"
            />
        </div>
    );

    return (
        <div className="Overview">
            <ProfileSection
                section="Overview"
                pageTitle={pageTitle}
                mainContent={mainContent}
                sideBar={sideBar}
                handleToken={props.handleToken}
            />
        </div>
    );
};

export default Overview;
