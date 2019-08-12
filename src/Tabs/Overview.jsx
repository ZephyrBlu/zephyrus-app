import PageHeader from '../Components/PageHeader';
import StatBlock from '../Components/StatBlock';
import './CSS/Overview.css';

const Overview = () => (
    <div className="Overview">
        <PageHeader pageTitle="Profile Overview" />
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

        <section className="map-winrate">
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
        </section>
    </div>
);

export default Overview;
