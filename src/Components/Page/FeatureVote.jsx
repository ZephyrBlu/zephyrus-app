import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import UrlContext from '../../index';
import useFetch from '../../useFetch';
import InfoTooltip from '../shared/InfoTooltip';
import SpinningRingAnimation from '../shared/SpinningRingAnimation';
import './CSS/FeatureVote.css';

const FeatureVote = () => {
    const user = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [textInput, setTextInput] = useState('');
    const [checkboxState, setCheckboxState] = useState(Array(6).fill(false));
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [responseText, setResponseText] = useState(null);
    const urlPrefix = useContext(UrlContext);
    const maxSelected = 2;

    const checked = checkboxState.filter(state => state);
    const checkboxesSelected = checked.length;

    const features = [
        'Shareable Replay Pages',
        'Winrate Page (Matchup, map, game length)',
        'More in-game Info (Supply block, SPM)',
        'Demo Website for New Users',
        'Focus Goal Tracking (Premium)',
    ];

    const featureDescription = [
        <span>Replays will generate links to individual replay pages</span>,
        <span>A comprehensive winrate page that tracks seasonal and weekly winrate.<br /><br />Matchup and map winrates will be tracked along with your winrate relative to the duration of matches</span>,
        <span>Richer in-game information such as supply block and screens-per-minute (SPM).<br /><br />Other possibilities include race-specific stats or duration of unit vs building selection (i.e. macro vs micro).<br /><br />Open to suggestions</span>,
        <span>A demo website where people can try out the site as though they are signed up and have uploaded replays</span>,
        <span>A feature to allow users to create and track specific goals based on in-game events or game-states, as well as tracking winrate in relation to their goal.<br /><br />Focus Goals will be intergrated into the Replays page as well as having their own page.<br /><br />This is the first planned premium feature for Zephyrus</span>,
    ];

    const featureCodes = [
        'shareable-replay-pages',
        'winrate-page',
        'game-info',
        'demo-website',
        'focus-goal-tracking',
        'other',
    ];

    const featureVotes = useFetch(`${urlPrefix}api/vote/`, user, 'votes');

    useEffect(() => {
        if (featureVotes) {
            for (let i = 0; i < featureCodes.length; i += 1) {
                const currentFeature = featureCodes[i];
                featureVotes.forEach(([feature, comment]) => {
                    if (feature === currentFeature) {
                        setCheckboxState((prevState) => {
                            prevState[i] = true;
                            return [...prevState];
                        });

                        if (feature === 'other') {
                            setTextInput(comment);
                        }
                    }
                });
            }
            setIsLoading(false);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setResponseText(null);

        const votes = {};
        featureCodes.forEach((featureCode, index) => {
            if (checkboxState[index]) {
                // if we are at the end of the feature codes
                // i.e at 'other'
                if (index === features.length) {
                    votes[featureCode] = textInput.trim();
                } else {
                    votes[featureCode] = '';
                }
            }
        });

        const url = `${urlPrefix}api/vote/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Token ${user.token}` },
            body: JSON.stringify({
                features: featureCodes,
                votes,
            }),
        });
        setIsFormSubmitted(false);
        setResponseText(response.ok ? 'Vote Successful' : 'Vote Failed');
    };

    const updateTextInput = (e) => {
        const currentText = e.target.value;
        setTextInput(currentText.slice(0, 100));
    };

    const handleCheckboxClick = (featureIndex) => {
        const isFeatureChecked = checkboxState[featureIndex];
        if (checkboxesSelected < maxSelected || isFeatureChecked) {
            setCheckboxState((prevState) => {
                prevState[featureIndex] = !isFeatureChecked;
                return [...prevState];
            });
        }
    };

    return (
        <div className="FeatureVote">
            <h1 className="FeatureVote__title">
                Feature Vote
            </h1>
            <h2 className="FeatureVote__sub-title">
                Vote on which feature you want in the next update
                <br />
                You may choose&nbsp;
                <span style={{ textDecoration: 'underline' }}>
                    up to 2
                </span>
                &nbsp;features and resubmit at any time
            </h2>
            <form className="FeatureVote__form" onSubmit={handleSubmit}>
                {features.map((featureText, index) => (
                    <div key={`feature-${index}`} className="FeatureVote__input-wrapper">
                        <input
                            key={`feature-${index}-input`}
                            className="FeatureVote__checkbox"
                            type="checkbox"
                            id={`feature-${index}`}
                            name={`feature-${index}`}
                            checked={checkboxState[index]}
                            disabled={isLoading}
                            onChange={() => handleCheckboxClick(index)}
                        />
                        <label key={`feature-${index}-label`} htmlFor={`feature-${index}`} className="FeatureVote__label">
                            {featureText}
                            <InfoTooltip
                                content={featureDescription[index]}
                                width={20}
                                height={20}
                                style={{
                                    height: '20px',
                                    width: '20px',
                                    top: '0px',
                                    left: '5px',
                                }}
                            />
                        </label>
                    </div>
                ))}
                <div className="FeatureVote__input-wrapper FeatureVote__input-wrapper--last">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-last"
                        name="feature-last"
                        checked={checkboxState[features.length]}
                        onChange={() => handleCheckboxClick(features.length)}
                    />
                    <input
                        className="FeatureVote__text-input FeatureVote__label"
                        type="text"
                        placeholder="Other"
                        value={textInput}
                        onChange={updateTextInput}
                        disabled={!checkboxState[features.length]}
                    />
                </div>
                <div className="FeatureVote__submit-wrapper">
                    <input
                        className="FeatureVote__form-submit"
                        type="submit"
                        value="VOTE"
                        disabled={isLoading || isFormSubmitted || checkboxesSelected === 0 || (!textInput && checkboxState[features.length])}
                    />
                    {isFormSubmitted && checkboxesSelected !== 0 &&
                        <SpinningRingAnimation
                            style={{
                                position: 'absolute',
                                marginLeft: '160px',
                            }}
                        />}
                </div>
            </form>
            {responseText &&
                <p className="FeatureVote__message">
                    {responseText}
                </p>}
        </div>
    );
};

export default FeatureVote;
