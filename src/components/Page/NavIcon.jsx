import React, { Fragment } from 'react';

const NavIcon = ({ icon, text }) => (
    <Fragment>
        <img
            src={`../../icons/${icon}-icon2.svg`}
            style={{
                width: '22px',
                height: '22px',
            }}
            alt={icon}
        />
        {text &&
            <span style={{ marginTop: '2px', marginLeft: '10px' }}>
                {text}
            </span>}
    </Fragment>
);

export default NavIcon;
