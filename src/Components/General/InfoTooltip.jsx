import Tippy from '@tippy.js/react';

const InfoTooltip = props => (
    <Tippy
        content={props.content}
        arrow
    >
        <svg
            className="InfoTooltip"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={props.width || '25'}
            height={props.height || '25'}
            viewBox="0 0 172 172"
            style={{
                position: 'relative',
                top: '5px',
                right: '-5px',
                ...props.style,
            }}
        >
            <g
                fill="none"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
            >
                <path
                    d="M0,172v-172h172v172z"
                    fill="none"
                />
                <g fill="#787878">
                    <g id="surface1">
                        <path
                            d="M86,21.5c-35.56738,0 -64.5,28.93262 -64.5,64.5c0,35.56739 28.93262,64.5 64.5,64.5c35.56739,0 64.5,-28.93261 64.5,-64.5c0,-35.56738 -28.93261,-64.5 -64.5,-64.5zM86,32.25c29.75146,0 53.75,23.99854 53.75,53.75c0,29.75146 -23.99854,53.75 -53.75,53.75c-29.75146,0 -53.75,-23.99854 -53.75,-53.75c0,-29.75146 23.99854,-53.75 53.75,-53.75zM86,53.75c-11.8208,0 -21.5,9.6792 -21.5,21.5h10.75c0,-6.00488 4.74512,-10.75 10.75,-10.75c6.00489,0 10.75,4.74512 10.75,10.75c0,4.11523 -2.64551,7.76856 -6.55078,9.07031l-2.18359,0.67188c-4.38818,1.44873 -7.39062,5.64795 -7.39062,10.24609v6.88672h10.75v-6.88672l2.18359,-0.67187c8.27246,-2.75049 13.94141,-10.60303 13.94141,-19.31641c0,-11.8208 -9.6792,-21.5 -21.5,-21.5zM80.625,107.5v10.75h10.75v-10.75z"
                        />
                    </g>
                </g>
            </g>
        </svg>
    </Tippy>
);

export default InfoTooltip;
