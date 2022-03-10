import React, { useState } from 'react';
import './CSS/ReplayNav.css';

const ReplayNav = () => {
    const [currentPage, setCurrentPage] = useState('Summary');
    const replayPages = [
        'Summary',
        'Timeline',
    ];

    return (
        <div className="ReplayNav">
            {replayPages.map(pageName => (
                <a
                    key={pageName}
                    className={`ReplayNav__page ${pageName === currentPage ? 'ReplayNav__page--current' : ''}`}
                    onClick={() => setCurrentPage(pageName)}
                >
                    {pageName}
                </a>
            ))}
        </div>
    );
};

export default ReplayNav;
