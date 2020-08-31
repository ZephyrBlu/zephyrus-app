import React, { useState, useContext, Fragment } from 'react';
import { useSelector } from 'react-redux';
import UrlContext from '../../index';
import SpinningRingAnimation from '../shared/SpinningRingAnimation';
import './CSS/FeedbackForm.css';

const FeedbackForm = ({ titleQuote, setShowFeedbackForm }) => {
    const user = useSelector(state => state.user);
    const [feedbackType, setFeedbackType] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [feedbackResponse, setFeedbackResponse] = useState(null);
    const urlPrefix = useContext(UrlContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setFeedbackResponse(null);

        const url = `${urlPrefix}api/feedback/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Token ${user.token}` },
            body: JSON.stringify({
                feedback: textInput,
                type: feedbackType,
            }),
        }).catch(() => null);

        if (response && response.ok) {
            setFeedbackResponse(true);
            setTimeout(() => {
                setShowFeedbackForm(false);
                setFeedbackResponse(null);
                setTextInput('');
                setFeedbackType(null);
                setIsFormSubmitted(false);
            }, 500);
        } else {
            setFeedbackResponse(false);
            setIsFormSubmitted(false);
        }
    };

    const updateTextInput = (e) => {
        let currentText = e.target.value;
        if (currentText.length > 300) {
            currentText = currentText.slice(0, 300);
        }
        setTextInput(currentText);
    };

    return (
        <div className="FeedbackForm">
            {titleQuote &&
                <Fragment>
                    <h1 className="FeedbackForm__title-quote">
                        {titleQuote.quote}
                    </h1>
                    <h2 className="FeedbackForm__quote-unit">
                        &#8212; {titleQuote.unit}
                    </h2>
                </Fragment>}
            <p className="FeedbackForm__info">
                I&rsquo;m Luke, the human behind Zephyrus.
                <br />
                <br />
                My goal is to create an awesome tool to help people
                get better at SC2, but I need your help to make that happen.
            </p>
            <div className="FeedbackForm__select-feedback-type">
                <button
                    className={`
                        FeedbackForm__feedback-type
                        FeedbackForm__feedback-type--issue
                        ${feedbackType === 'issue' ? 'FeedbackForm__feedback-type--active' : ''}
                    `}
                    onClick={() => setFeedbackType('issue')}
                    disabled={isFormSubmitted}
                >
                    Report an Issue
                </button>
                <button
                    className={`
                    FeedbackForm__feedback-type
                    FeedbackForm__feedback-type--suggestion
                    ${feedbackType === 'suggestion' ? 'FeedbackForm__feedback-type--active' : ''}
                `}
                    onClick={() => setFeedbackType('suggestion')}
                    disabled={isFormSubmitted}
                >
                    Make a Suggestion
                </button>
            </div>
            <form className="FeedbackForm__form" onSubmit={handleSubmit}>
                <textarea
                    className="FeedbackForm__text-input"
                    type="text"
                    placeholder={feedbackType === 'issue'
                        ? 'I\'m having trouble with...'
                        : 'It would be cool if...'}
                    disabled={isFormSubmitted}
                    value={textInput}
                    onChange={updateTextInput}
                    rows="9"
                    cols="54"
                />
                <div className="FeedbackForm__submit-wrapper">
                    <button
                        className="FeedbackForm__form-submit"
                        type="submit"
                        disabled={
                            !feedbackType
                            || isFormSubmitted
                            || textInput.length < 10
                        }
                    >
                        {feedbackResponse === null && !isFormSubmitted && (feedbackType
                            ? `Send ${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}`
                            : '')}
                        {feedbackResponse === true && 'Submission Successful'}
                        {feedbackResponse === false && 'Failed. Click to try again'}
                    </button>
                    {isFormSubmitted && feedbackResponse !== true &&
                        <SpinningRingAnimation
                            style={{
                                position: 'absolute',
                                margin: '4px 0 0',
                            }}
                        />}
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
