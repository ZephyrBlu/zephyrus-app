import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
    setReplays,
    setReplayInfo,
    setTrends,
    setSelectedReplayHash,
} from '../actions';
import './Upload.css';

const Upload = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [uploadReponse, setUploadResponse] = useState(null);

    let urlPrefix;
    if (process.env.NODE_ENV === 'development') {
        urlPrefix = 'http://127.0.0.1:8000/';
    } else {
        urlPrefix = 'https://zephyrus.gg/';
    }

    const uploadFiles = async (event) => {
        const files = event.target.files;

        const fileList = [];
        Object.keys(files).forEach((fileNum, index) => {
            if (index < 100 && fileNum !== 'length') {
                fileList.push(files[fileNum]);
            }
        });

        setUploadInProgress(true);

        const url = `${urlPrefix}api/upload/`;

        let success = 0;
        let fail = 0;
        fileList.forEach((file) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${user.token}`,
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

        // reduce number of actions dispatched
        // refactor into general 'reset' action?
        dispatch(setReplays([]));
        dispatch(setReplayInfo([]));
        dispatch(setSelectedReplayHash(null));
        dispatch(setTrends(null));
    };

    return (
        <div className="Upload">
            <ul className="Upload__info">
                <li className="Upload__info-item">
                    Only ladder 1v1&#39;s are supported. Other replays will be skipped
                </li>
                <li className="Upload__info-item">
                    You can upload up to 100 replays at a time
                </li>
                <li className="Upload__info-item">
                    Each replay will take a few seconds to upload and process
                </li>
                <li className="Upload__info-item">
                    Stay on this page during the upload
                </li>
            </ul>
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
            </form>
            {uploadInProgress &&
                <p className="Upload__status">
                    Uploading your replays now...
                </p>}
            {uploadReponse && <p className="Upload__success">{uploadReponse}</p>}
            <p className="Upload__message">
                Having trouble uploading replays?<br />
                Contact me on&nbsp;
                <a
                    href="https://www.reddit.com/user/ZephyrBluu/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Reddit
                </a>, Discord (ZephyrBlu#4524)
                or at&nbsp;
                <a
                    href="mailto:hello@zephyrus.gg"
                >
                    hello@zephyrus.gg
                </a>
                <br />
                <br />
                Replays from new patches may not be supported for&nbsp;
                <span style={{ textDecoration: 'underline' }}>1-2 days</span>
                &nbsp;after the patch drops.<br /><br />
                Please be patient until the site is updated.
            </p>
        </div>
    );
};

export default Upload;
