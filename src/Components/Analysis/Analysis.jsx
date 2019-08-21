import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
// import Tippy from '@tippy.js/react';
import ProfileSection from '../General/ProfileSection';
import './CSS/Analysis.css';

const Analysis = () => {
    const token = useSelector(state => `Token ${state.token}`);
    const [playerTrends, setPlayerTrends] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            const url = 'https://zephyrus.gg/api/stats/';

            const trends = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                JSON.parse(responseBody)
            )).catch(() => (null));

            setPlayerTrends(trends);
        };
        getStats();
    }, []);

    const pageTitle = 'Trend Analysis';

    const statOrder = {
        sq: 'SQ',
        apm: 'APM',
        workers_produced: 'Workers Produced',
        workers_lost: 'Workers Lost',
        avg_unspent_resources: 'Avg Unspent Resources',
        avg_resource_collection_rate: 'Avg Collection Rate',
        resources_lost: 'Resources Lost',
        inject_count: 'Inject Count',
    };

    const mainContent = (
        <div className="trends">
            {playerTrends && Object.keys(statOrder).map(statName => (
                Object.prototype.hasOwnProperty.call(playerTrends.total_median[statName], 'minerals') ?
                    (
                        <div key={statName} className="trends__stat">
                            <span key={`${statName}-title`} className="trends__stat-title-area">
                                <h2 className="trends__stat-title">
                                    {statOrder[statName]} (Minerals/Gas)
                                </h2>
                            </span>
                            <span key={`${statName}-avg`} className="trends__average">
                                Avg: {playerTrends.total_median[statName].minerals}
                                <small>&#177;{playerTrends.total_MAD[statName].minerals}</small>
                                /{playerTrends.total_median[statName].gas}
                                <small>&#177;{playerTrends.total_MAD[statName].gas}</small>
                            </span>
                            <span key={`${statName}-win`} className="trends__win">
                                <span key={`${statName}-win-name`} className="trends__trend--positive">
                                    Win
                                </span>
                                :&#160;{playerTrends.win_median[statName].minerals}
                                <small>&#177;{playerTrends.win_MAD[statName].minerals}</small>
                                /{playerTrends.win_median[statName].gas}
                                <small>&#177;{playerTrends.win_MAD[statName].gas}</small>
                                &#160;({playerTrends.win_diff[statName].minerals >= 0 ?
                                    <span key={`${statName}-win-diff`} className="trends__trend--positive">
                                        +{playerTrends.win_diff[statName].minerals}/{playerTrends.win_diff[statName].gas}%
                                    </span>
                                    :
                                    <span key={`${statName}-win-diff`} className="trends__trend--positive">
                                        {playerTrends.win_diff[statName].minerals}/{playerTrends.win_diff[statName].gas}%
                                    </span>
                                })
                            </span>
                            <span key={`${statName}-loss`} className="trends__loss">
                                <span key={`${statName}-win-name`} className="trends__trend--negative">
                                    Loss
                                </span>
                                :&#160;{playerTrends.loss_median[statName].minerals}
                                <small>&#177;{playerTrends.loss_MAD[statName].minerals}</small>
                                /{playerTrends.loss_median[statName].gas}
                                <small>&#177;{playerTrends.loss_MAD[statName].gas}</small>
                                &#160;({playerTrends.loss_diff[statName].minerals >= 0 ?
                                    <span key={`${statName}-loss-diff`} className="trends__trend--negative">
                                        +{playerTrends.loss_diff[statName].minerals}/{playerTrends.loss_diff[statName].gas}%
                                    </span>
                                    :
                                    <span key={`${statName}-loss-diff`} className="trends__trend--negative">
                                        {playerTrends.loss_diff[statName].minerals}/{playerTrends.loss_diff[statName].gas}%
                                    </span>
                                })
                            </span>
                        </div>
                    )
                    :
                    (
                        <div key={statName} className="trends__stat">
                            <span key={`${statName}-title`} className="trends__stat-title-area">
                                <h2 className="trends__stat-title">
                                    {statOrder[statName]}
                                </h2>
                            </span>
                            <span key={`${statName}-avg`} className="trends__average">Avg: {playerTrends.total_median[statName]}
                                <small>&#177;{playerTrends.total_MAD[statName]}</small>
                            </span>
                            <span key={`${statName}-win`} className="trends__win">
                                <span key={`${statName}-win-name`} className="trends__trend--positive">
                                    Win
                                </span>
                                :&#160;{playerTrends.win_median[statName]}
                                <small>&#177;{playerTrends.win_MAD[statName]}</small>
                                &#160;({playerTrends.win_diff[statName] >= 0 ?
                                    <span key={`${statName}-win-diff`} className="trends__trend--positive">
                                        +{playerTrends.win_diff[statName]}%
                                    </span>
                                    :
                                    <span key={`${statName}-win-diff`} className="trends__trend--positive">
                                        {playerTrends.win_diff[statName]}%
                                    </span>
                                })
                            </span>
                            <span key={`${statName}-loss`} className="trends__loss">
                                <span key={`${statName}-win-name`} className="trends__trend--negative">
                                    Loss
                                </span>
                                :&#160;{playerTrends.loss_median[statName]}
                                <small>&#177;{playerTrends.loss_MAD[statName]}</small>
                                &#160;({playerTrends.loss_diff[statName] >= 0 ?
                                    <span key={`${statName}-loss-diff`} className="trends__trend--negative">
                                        +{playerTrends.loss_diff[statName]}%
                                    </span>
                                    :
                                    <span key={`${statName}-loss-diff`} className="trends__trend--negative">
                                        {playerTrends.loss_diff[statName]}%
                                    </span>
                                })
                            </span>
                        </div>
                    )
            ))}
        </div>
    );

    return (
        <div className="Analysis">
            <ProfileSection
                section="Analysis"
                pageTitle={pageTitle}
                mainContent={mainContent}
            />
        </div>
    );
};

export default Analysis;
