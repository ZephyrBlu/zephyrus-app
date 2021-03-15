import React from 'react';

const DefaultResponse = ({ style, content }) => (
    <p style={{ textAlign: 'center', ...style }}>
        {content}
    </p>
);

export default DefaultResponse;
