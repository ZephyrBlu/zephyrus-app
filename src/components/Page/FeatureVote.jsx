import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import UrlContext from '../../index';
// import useFetch from '../../hooks/useFetch';
import SpinningRingAnimation from '../shared/SpinningRingAnimation';
import './CSS/FeatureVote.css';

const FeatureVote = () => {
    // const user = useSelector(state => state.user);
    const [textInput, setTextInput] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [responseText, setResponseText] = useState(null);
    // const urlPrefix = useContext(UrlContext);

    // const featureVotes = useFetch(`${urlPrefix}api/vote/`, user, 'votes');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setResponseText(null);

        // const votes = {};
        // featureCodes.forEach((featureCode, index) => {
        //     if (checkboxState[index]) {
        //         // if we are at the end of the feature codes
        //         // i.e at 'other'
        //         if (index === features.length) {
        //             votes[featureCode] = textInput.trim();
        //         } else {
        //             votes[featureCode] = '';
        //         }
        //     }
        // });

        // const url = `${urlPrefix}api/vote/`;
        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: { Authorization: `Token ${user.token}` },
        //     body: JSON.stringify({
        //         features: featureCodes,
        //         votes,
        //     }),
        // });
        // setIsFormSubmitted(false);
        // setResponseText(response.ok ? 'Vote Successful' : 'Vote Failed');
    };

    const updateTextInput = (e) => {
        const currentText = e.target.value;
        setTextInput(currentText.slice(0, 300));
    };

    return (
        <div className="FeatureVote">
            <h1 className="FeatureVote__title">
                I&rsquo;d love to hear from you!
            </h1>
            <h2 className="FeatureVote__sub-title">
                I&rsquo;m Luke, the sole person behind Zephyrus.
                <br />
                <br />
                My goal is to create an awesome tool to help people
                get better at SC2, but I need your help to make that happen.
                <br />
                <br />
                If you have any suggestions to make Zephyrus better,
                let me know below.
            </h2>
            <form className="FeatureVote__form" onSubmit={handleSubmit}>
                <div className="FeatureVote__input-wrapper">
                    <textarea
                        className="FeatureVote__text-input"
                        type="text"
                        placeholder=""
                        value={textInput}
                        onChange={updateTextInput}
                        rows="10"
                        cols="50"
                    />
                </div>
                <div className="FeatureVote__submit-wrapper">
                    <input
                        className="FeatureVote__form-submit"
                        type="submit"
                        value="Send Feedback"
                    />
                    {isFormSubmitted &&
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
