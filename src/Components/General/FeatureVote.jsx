import { useState, Fragment } from 'react';
import SpinningRingAnimation from '../General/SpinningRingAnimation';
import './CSS/FeatureVote.css';

const FeatureVote = () => {
    const [disableTextInput, setDisableTextInput] = useState(true);
    const [checkboxesSelected, setCheckboxesSelected] = useState(0);
    const maxSelected = 2;

    const [feature1Checked, setFeature1Checked] = useState(false);
    const [feature2Checked, setFeature2Checked] = useState(false);
    const [feature3Checked, setFeature3Checked] = useState(false);
    const [feature4Checked, setFeature4Checked] = useState(false);
    const [feature5Checked, setFeature5Checked] = useState(false);

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setTimeout(() => {
            setIsFormSubmitted(false);
        }, 2000);
    };

    const handleCheckboxClick = (selection, setSelection, textField = false) => {
        if (checkboxesSelected < maxSelected || selection) {
            if (selection) {
                setCheckboxesSelected(checkboxesSelected - 1);
                setSelection(false);
            } else {
                setCheckboxesSelected(checkboxesSelected + 1);
                setSelection(true);
            }

            if (textField) {
                disableTextInput ?
                    setDisableTextInput(false) : setDisableTextInput(true);
            }
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
                &nbsp;features
            </h2>
            <form className="FeatureVote__form" onSubmit={e => handleSubmit(e)}>
                <div className="FeatureVote__input-wrapper">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-1"
                        name="feature-1"
                        checked={feature1Checked}
                        onChange={() => {
                            handleCheckboxClick(feature1Checked, setFeature1Checked);
                        }}
                    />
                    <label htmlFor="feature-1" className="FeatureVote__label">
                        Shareable Replay Pages
                    </label>
                </div>
                <div className="FeatureVote__input-wrapper">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-2"
                        name="feature-2"
                        checked={feature2Checked}
                        onChange={() => {
                            handleCheckboxClick(feature2Checked, setFeature2Checked);
                        }}
                    />
                    <label htmlFor="feature-2" className="FeatureVote__label">
                            Winrate Page (Matchup, map, game length)
                    </label>
                </div>
                <div className="FeatureVote__input-wrapper">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-3"
                        name="feature-3"
                        checked={feature3Checked}
                        onChange={() => {
                            handleCheckboxClick(feature3Checked, setFeature3Checked);
                        }}
                    />
                    <label htmlFor="feature-3" className="FeatureVote__label">
                        More in-game Info (Supply block, SPM)
                    </label>
                </div>
                <div className="FeatureVote__input-wrapper">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-4"
                        name="feature-4"
                        checked={feature4Checked}
                        onChange={() => {
                            handleCheckboxClick(feature4Checked, setFeature4Checked);
                        }}
                    />
                    <label htmlFor="feature-4" className="FeatureVote__label">
                        Demo Website for New Users
                    </label>
                </div>
                <div className="FeatureVote__input-wrapper FeatureVote__input-wrapper--last">
                    <input
                        className="FeatureVote__checkbox"
                        type="checkbox"
                        id="feature-5"
                        name="feature-5"
                        checked={feature5Checked}
                        onChange={() => {
                            handleCheckboxClick(feature5Checked, setFeature5Checked, true);
                        }}
                    />
                    {disableTextInput ?
                        <input
                            className="FeatureVote__text-input FeatureVote__label"
                            type="text"
                            htmlFor="feature-5"
                            placeholder="Other"
                            disabled
                        />
                        :
                        <input
                            className="FeatureVote__text-input FeatureVote__label"
                            type="text"
                            htmlFor="feature-5"
                            placeholder="Other"
                        />
                    }
                </div>
                <div className="FeatureVote__submit-wrapper">
                    {isFormSubmitted || checkboxesSelected === 0 ?
                        <Fragment>
                            <input
                                className="FeatureVote__form-submit"
                                type="submit"
                                value="VOTE"
                                disabled
                            />
                            {checkboxesSelected !== 0 && <SpinningRingAnimation />}
                        </Fragment>
                        :
                        <input
                            className="FeatureVote__form-submit"
                            type="submit"
                            value="VOTE"
                        />}
                </div>
            </form>
        </div>
    );
};

export default FeatureVote;
