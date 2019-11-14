import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { setReplayList, setBattlenetStatus, setTrends, setSelectedReplayHash } from '../../actions';
import InfoTooltip from '../General/InfoTooltip';
import ProfileSection from '../General/ProfileSection';
import SpinningRingAnimation from '../General/SpinningRingAnimation';
import './CSS/Upload.css';

const Upload = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);
    const hasAuthenticatedBattlenet = useSelector(state => state.battlenetStatus);
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [uploadReponse, setUploadResponse] = useState(null);

    useEffect(() => {
        const checkBattlenetAccount = async () => {
            let urlPrefix;
            if (process.env.NODE_ENV === 'development') {
                urlPrefix = 'http://127.0.0.1:8000/';
            } else {
                urlPrefix = 'https://zephyrus.gg/';
            }

            const url = `${urlPrefix}api/authorize/check/`;

            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then(response => (
                response.status
            )).catch(() => null);

            if (result === 200) {
                dispatch(setBattlenetStatus(true));
            } else {
                dispatch(setBattlenetStatus(false));
            }
        };
        if (!hasAuthenticatedBattlenet) {
            checkBattlenetAccount();
        }
    }, []);

    const authorizeBattlenetAccount = async () => {
        const url = `${process.env.BACKEND_URL}api/authorize/url/`;

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then(response => (
            response.status
        )).catch(() => null);

        if (result === 200) {
            dispatch(setBattlenetStatus(true));
        }
    };

    const uploadFiles = async (event) => {
        const files = event.target.files;

        const fileList = [];
        Object.keys(files).forEach((fileNum, index) => {
            if (index < 100 && fileNum !== 'length') {
                fileList.push(files[fileNum]);
            }
        });

        setUploadInProgress(true);

        const url = `${process.env.BACKEND_URL}api/upload/`;

        let success = 0;
        let fail = 0;
        fileList.forEach((file) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: file,
            }).then((response) => {
                if (response.status === 200) {
                    success += 1;
                } else {
                    fail += 1;
                }
                setUploadInProgress(false);
                setUploadResponse(`${success}/${fileList.length} uploaded, ${fail} failed to process`);
                return response.json();
            }).then(responseBody => (
                responseBody
            )).catch(() => null);
        });
        dispatch(setReplayList([]));
        dispatch(setSelectedReplayHash(null));
        dispatch(setTrends(null));
    };

    const mainContent = (
        <div className="Upload">
            <ul className="Upload__info">
                <li className="Upload__info-item">
                    You can upload up to 100 replays at a time
                </li>
                <li className="Upload__info-item">
                    The selected replays will be uploaded automatically
                </li>
                <li className="Upload__info-item">
                    Each replay will take a few seconds to upload and process
                </li>
                <li className="Upload__info-item">
                    Duplicate uploads will be skipped
                </li>
                <li className="Upload__info-item">
                    Stay on this page during the upload
                </li>
            </ul>
            {hasAuthenticatedBattlenet &&
            <form className="Upload__file-form" encType="multiple/form-data" onSubmit={uploadFiles}>
                <input
                    className="Upload__form-input"
                    type="file"
                    name="file"
                    id="id_fileUpload"
                    accept=".SC2Replay"
                    multiple
                    required
                    onChange={uploadFiles}
                />
            </form>}
            {!hasAuthenticatedBattlenet && (hasAuthenticatedBattlenet === false ?
                <p className="Upload__authorize-message">
                    Please&nbsp;
                    <button
                        className="Upload__battlenet-authorize"
                        onClick={authorizeBattlenetAccount}
                    >
                        Link your Battlenet Account
                    </button>
                    <InfoTooltip
                        content={
                            <span>
                                <span>
                                    {`Linking your Battlenet account lets us identify 
                                    you in replays and associate replays with your account.`}
                                </span>
                                <br />
                                <br />
                                <span>
                                    {`We use your Battletag to associate replays 
                                    with your account and the Profile IDs 
                                    of your account in each region to identify you 
                                    in replays.`}
                                </span>
                                <br />
                                <br />
                                <span>
                                    {`If you don't link your account we won't 
                                    be able to display and analyze your replays.`}
                                </span>
                            </span>
                        }
                    />
                </p>
                :
                <p className="Upload__authorize-message">
                    Verifying your Battlenet Account
                    <SpinningRingAnimation />
                </p>)
            }
            {uploadInProgress &&
                <p className="Upload__status">
                    Uploading your replays now...
                </p>}
            {uploadReponse && <p className="Upload__success">{uploadReponse}</p>}
        </div>
    );

    return (
        <ProfileSection
            section="Upload"
            pageTitle={props.pageTitle}
            mainContent={mainContent}
        />
    );
};

export default Upload;
