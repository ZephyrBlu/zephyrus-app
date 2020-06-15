import './CSS/TrendStat.css';

const TrendStat = ({ stat, statName, trends, recentPercentDiff, modifier }) => (
    stat === 'winrate' ?
        null
        :
        <div
            key={stat}
            className={`
                TrendStat__stat 
                ${modifier ? `TrendStat__stat--${modifier}` : ''}
            `}
        >
            <ul className="TrendStat__stat-title-area">
                <li>
                    <h2 className="TrendStat__stat-title">
                        {statName}
                    </h2>
                </li>
                <li>
                    <span className="TrendStat__stat-trend">
                        {recentPercentDiff && (recentPercentDiff[stat][1] >= 0 ?
                            <span className={`TrendStat__trend--positive TrendStat__trend--${stat}-positive`}>
                                +{recentPercentDiff[stat][1]}%
                            </span>
                            :
                            <span className={`TrendStat__trend--negative TrendStat__trend--${stat}-negative`}>
                                {recentPercentDiff[stat][1]}%
                            </span>)} this week
                    </span>
                </li>
            </ul>
            <ul className="TrendStat__stat-info">
                <li key={`${stat}-avg`} className="TrendStat__average">
                    {trends.total_median[stat]}
                    <span className="TrendStat__average-uncertainty">&#177;{trends.total_MAD[stat]}</span>
                </li>
                <li key={`${stat}-win`} className="TrendStat__win">
                    <span key={`${stat}-win-name`} className="TrendStat__trend--positive-highlight">
                        {trends.win_median[stat]}
                        <small>&#177;{trends.win_MAD[stat]}</small>
                        &#160;({trends.win_diff[stat] >= 0 ?
                            <span key={`${stat}-win-diff`}>
                                +{trends.win_diff[stat]}%
                            </span>
                            :
                            <span key={`${stat}-win-diff`}>
                                {trends.win_diff[stat]}%
                            </span>
                        })
                    </span>
                </li>
                <li key={`${stat}-loss`} className="TrendStat__loss">
                    <span key={`${stat}-win-name`} className="TrendStat__trend--negative-highlight">
                        {trends.loss_median[stat]}
                        <small>&#177;{trends.loss_MAD[stat]}</small>
                        &#160;({trends.loss_diff[stat] >= 0 ?
                            <span key={`${stat}-loss-diff`}>
                                +{trends.loss_diff[stat]}%
                            </span>
                            :
                            <span key={`${stat}-loss-diff`}>
                                {trends.loss_diff[stat]}%
                            </span>
                        })
                    </span>
                </li>
            </ul>
        </div>
);

export default TrendStat;
