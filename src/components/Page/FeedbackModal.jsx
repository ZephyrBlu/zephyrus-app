import React, { useState, useEffect } from 'react';
import Tippy from '@tippy.js/react';
import FeedbackForm from './FeedbackForm';

const FeedbackModal = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [helpQuote, setHelpQuote] = useState(null);

    const HELP_QUOTES = {
        'Yes, Executor?': 'Adept',
        'What would you ask of us?': 'Dark Templar',
        'Speak and be heard': 'Disruptor',
        'I hear the call': 'Immortal',
        'You require my skills?': 'Stalker',
        'It shall be done': 'Void Ray',
        'You seek guidance?': 'Oracle',
        'Who called in the fleet?': 'Battlecruiser',
        'I hear you': 'Hellbat',
        'Talk to me, boss!': 'Hellion',
        'You gonna give me orders?': 'Marine',
        'Where\'s the emergency?': 'Medivac',
        'State your request': 'Raven',
        'I\'m listenin\'': 'Reaper',
    };

    useEffect(() => {
        let timeout;
        if (!isFormVisible) {
            const debounce = isFormVisible ? 0 : 200;
            timeout = setTimeout(() => {
                const quoteKeys = Object.keys(HELP_QUOTES);
                const selectedQuote = quoteKeys[Math.floor(Math.random() * quoteKeys.length)];
                const selectedQuoteUnit = HELP_QUOTES[selectedQuote];
                setHelpQuote({ quote: selectedQuote, unit: selectedQuoteUnit });
            }, debounce);
        }
        return () => clearTimeout(timeout);
    }, [isFormVisible]);

    return (
        <Tippy
            className="Page__feature-vote-content"
            content={
                <FeedbackForm
                    titleQuote={helpQuote}
                    setIsFormVisible={setIsFormVisible}
                />
            }
            placement="top-end"
            trigger="manual"
            maxWidth={400}
            visible={isFormVisible}
            hideOnClick={false}
            interactive
        >
            <div className="Page__feedback">
                <button
                    className="Page__show-vote"
                    onClick={() => (
                        isFormVisible ?
                            setIsFormVisible(false) : setIsFormVisible(true)
                    )}
                >
                    Talk to a Human&nbsp;
                    <img
                        className="Page__feature-vote-arrow"
                        src="../../icons/arrow-right-black.svg"
                        alt="show-feature-vote"
                    />
                </button>
            </div>
        </Tippy>
    );
};

export default FeedbackModal;
