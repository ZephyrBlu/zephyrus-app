import React from 'react';

const PerformanceTooltip = (props) => {
    console.log(props);
    // if (!props.payload) {
    //     return [value, name, props];
    // }
    // console.log(value, name, props);
    // let formattedValue;
    // const formattedName = props.payload.value;
    // const percentile = props.payload.percentile;
    // if (percentile === 0) {
    //     formattedValue = '(Min)';
    // } else if (percentile === 50) {
    //     formattedValue = '(Median)';
    // }  else if (percentile === 100) {
    //     formattedValue = '(Max)';
    // } else {
    //     formattedValue = `(${percentile < 50 ? `Bottom ${percentile}%` : `Top ${100 - percentile}%`})`;
    // }
    // return [formattedValue, formattedName, props];

    return (
        <div>
            <span>
                Tooltip
            </span>
        </div>
    );
};

export default PerformanceTooltip;
