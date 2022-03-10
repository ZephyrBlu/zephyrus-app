import React from 'react';
import './CSS/ReplayNav.css';

const ReplayNav = ({ page, setPage }) => {
    const replayPages = [
        'Summary',
        'Timeline',
    ];

    return (
        <div className="ReplayNav">
            {replayPages.map(pageName => (
                <a
                    key={pageName}
                    className={`ReplayNav__page ${pageName === page ? 'ReplayNav__page--current' : ''}`}
                    onClick={() => setPage(pageName)}
                >
                    {pageName}
                </a>
            ))}
        </div>
    );
};

export default ReplayNav;
