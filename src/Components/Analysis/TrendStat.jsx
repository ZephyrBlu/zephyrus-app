import './CSS/TrendStat.css';

const TrendStat = props => (
    props.stat === 'winrate' ?
        null
        :
        <div
            key={props.stat}
            className={`
                TrendStat__stat 
                ${props.modifier ? `TrendStat__stat--${props.modifier}` : ''}
            `}
        >
            <ul className="TrendStat__stat-title-area">
                <li>
                    <h2 className="TrendStat__stat-title">
                        {props.statName}
                    </h2>
                </li>
                <li>
                    <span className="TrendStat__stat-trend">
                        {props.recentPercentDiff && (props.recentPercentDiff[props.stat][1] >= 0 ?
                            <span className={`TrendStat__trend--positive Tooltip__value--${props.stat}-positive`}>
                                +{props.recentPercentDiff[props.stat][1]}%
                            </span>
                            :
                            <span className={`TrendStat__trend--negative Tooltip__value--${props.stat}-negative`}>
                                {props.recentPercentDiff[props.stat][1]}%
                            </span>)} this week
                    </span>
                </li>
            </ul>
            <ul className="TrendStat__stat-info">
                <li key={`${props.stat}-avg`} className="TrendStat__average">
                    {props.trends.total_median[props.stat]}
                    <span className="TrendStat__average-uncertainty">&#177;{props.trends.total_MAD[props.stat]}</span>
                </li>
                <li key={`${props.stat}-win`} className="TrendStat__win">
                    <span key={`${props.stat}-win-name`} className="TrendStat__trend--positive-highlight">
                        {props.trends.win_median[props.stat]}
                        <small>&#177;{props.trends.win_MAD[props.stat]}</small>
                        &#160;({props.trends.win_diff[props.stat] >= 0 ?
                            <span key={`${props.stat}-win-diff`}>
                                +{props.trends.win_diff[props.stat]}%
                            </span>
                            :
                            <span key={`${props.stat}-win-diff`}>
                                {props.trends.win_diff[props.stat]}%
                            </span>
                        })
                    </span>
                </li>
                <li key={`${props.stat}-loss`} className="TrendStat__loss">
                    <span key={`${props.stat}-win-name`} className="TrendStat__trend--negative-highlight">
                        {props.trends.loss_median[props.stat]}
                        <small>&#177;{props.trends.loss_MAD[props.stat]}</small>
                        &#160;({props.trends.loss_diff[props.stat] >= 0 ?
                            <span key={`${props.stat}-loss-diff`}>
                                +{props.trends.loss_diff[props.stat]}%
                            </span>
                            :
                            <span key={`${props.stat}-loss-diff`}>
                                {props.trends.loss_diff[props.stat]}%
                            </span>
                        })
                    </span>
                </li>
            </ul>
        </div>
);

export default TrendStat;
