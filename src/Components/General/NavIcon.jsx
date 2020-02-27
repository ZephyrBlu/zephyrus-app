import { Fragment } from 'react';

const NavIcon = props => (
    <Fragment>
        <img
            src={`../../icons/${props.icon}-icon.svg`}
            style={{
                width: '22px',
                height: '22px',
            }}
            alt={props.icon}
        />
        {props.text &&
            <span style={{ marginTop: '2px', marginLeft: '10px' }}>
                {props.text}
            </span>}
    </Fragment>
);

export default NavIcon;
