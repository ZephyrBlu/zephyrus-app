import React, { useLayoutEffect, useState } from 'react';
import InfoTooltip from '../shared/InfoTooltip';
import './CSS/StatCorrelations.css';

const StatCorrelations = (props) => {
    const [correlationStatCount, setCorrelationStatCount] = useState(4);

    useLayoutEffect(() => {
        const updateSize = () => {
            if (window.innerWidth > 1650) {
                setCorrelationStatCount(5);
            } else if (window.innerWidth > 1350) {
                setCorrelationStatCount(4);
            } else if (window.innerWidth > 1050) {
                setCorrelationStatCount(3);
            } else {
                setCorrelationStatCount(2);
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const { count, ...correlations } = props.correlations;
    const relevantCorrelations = Object.entries(correlations).sort((firstValues, secondValues) => (
        Math.abs(secondValues[1][1]) - Math.abs(firstValues[1][1])
    )).slice(0, correlationStatCount);

    const statNames = {
        sq: 'Spending Quotient',
        apm: 'Actions Per Minute',
        avg_unspent_resources_minerals: 'Unspent Minerals',
        avg_unspent_resources_gas: 'Unspent Gas',
        workers_produced: 'Workers Produced',
        workers_lost: 'Workers Lost',
        workers_killed: 'Workers Killed',
    };

    return (
        <div className="StatCorrelations">
            <h1 className="StatCorrelations__title">
                Winrate Correlations
                <InfoTooltip
                    content={
                        <span>
                            The % for each stat is the shared variance, which represents
                            how much one stat affects the other.
                            <br />
                            <br />
                            A higher % means that stat likely has a stronger impact on your winrate.
                            <br />
                            <br />
                            A positive correlation means when that stat increases,
                            your winrate also tends to increase and vice versa
                            for a negative correlation (I.e. stat increases, winrate decreases).
                        </span>
                    }
                />
            </h1>
            <div className="StatCorrelations__stat-correlations">
                {relevantCorrelations.map(([stat, value]) => (
                    <p key={`${stat}-correlation`} className="StatCorrelations__correlation">
                        <span className="StatCorrelations__stat-name">
                            {statNames[stat]}
                        </span>
                        <span className="StatCorrelations__correlation-direction">
                            <span
                                className={value[0] >= 0 ?
                                    'StatCorrelations__correlation-direction--positive'
                                    :
                                    'StatCorrelations__correlation-direction--negative'}
                            >
                                {value[0] >= 0 ? 'Positive' : 'Negative'} Correlation
                            </span>&nbsp;&nbsp;&nbsp;&nbsp;
                            {/* <span>
                                {value[0] >= 0 ? 'Keep doing this' : 'Improve at this'}
                            </span> */}
                        </span>
                        <span
                            className={`
                                StatCorrelations__correlation-value
                                ${value[0] >= 0 ? 'StatCorrelations__correlation-value--positive' : 'StatCorrelations__correlation-value--negative'}
                            `}
                        >
                            {value[1]}%
                        </span>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default StatCorrelations;
