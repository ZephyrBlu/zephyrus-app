import React from 'react';
import './CSS/ReplayStat.css';

const ReplayStat = ({ userId, stat, statName, statInfo, modifier }) => {
    const oppId = userId === 1 ? 2 : 1;
    let player1Highlight;
    let player2Highlight;

    const generateComparisonValues = (values) => {
        if (!Array.isArray(values[1])) {
            if (typeof values[1] === 'string') {
                return {
                    1: Number(values[userId]),
                    2: Number(values[oppId]),
                };
            }
            return {
                1: values[userId],
                2: values[oppId],
            };
        }

        const calcAvg = v => (
            v.reduce((a, b) => {
                if (typeof a === 'string') {
                    if (a.includes('k')) {
                        return Number(a.slice(0, -1)) + Number(b.slice(0, -1));
                    }
                    return Number(a) + Number(b);
                }
                return a + b;
            }, 0)
        );

        return {
            1: calcAvg(values[userId]),
            2: calcAvg(values[oppId]),
        };
    };

    const statValues = generateComparisonValues(statInfo);
    if (statValues[1] > statValues[2]) {
        player1Highlight = 'win';
        player2Highlight = 'loss';
    } else {
        player1Highlight = 'loss';
        player2Highlight = 'win';
    }

    const renderValues = (values) => {
        if (!Array.isArray(values)) {
            return values;
        }

        let valueString = '';
        values.forEach((val, index) => {
            if (index === 0) {
                valueString += val;
            } else {
                valueString += ` / ${val}`;
            }
        });
        return valueString;
    };

    return (
        <tr
            key={stat}
            className={`
                ReplayStat__stat 
                ${modifier ? `ReplayStat__stat--${modifier}` : ''}
            `}
        >
            <td className="ReplayStat__stat-title">{statName}</td>
            <td
                key={`${statInfo[userId]}-span`}
                className="ReplayStat__stat-value"
            >
                <div
                    className={`
                        ReplayStat__value-wrapper
                        ReplayStat__value-wrapper--${player1Highlight}
                        ReplayStat__value-wrapper--${stat}-${player1Highlight}
                    `}
                >
                    {renderValues(statInfo[userId])}
                </div>
            </td>
            <td
                key={`${statInfo[oppId]}-span`}
                className="ReplayStat__stat-value"
            >
                <div
                    className={`
                        ReplayStat__value-wrapper
                        ReplayStat__value-wrapper--${player2Highlight}
                        ReplayStat__value-wrapper--${stat}-${player2Highlight}
                    `}
                >
                    {renderValues(statInfo[oppId])}
                </div>
            </td>
        </tr>
    );
};

export default ReplayStat;
