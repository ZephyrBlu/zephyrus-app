import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setReplayList } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import './CSS/Upload.css';

const Upload = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);
    const [uploadReponse, setUploadResponse] = useState(null);

    const uploadFiles = async (event) => {
        const files = event.target.files;

        const fileList = [];
        Object.keys(files).forEach((fileNum) => {
            if (fileNum !== 'length') {
                fileList.push(files[fileNum]);
            }
        });

        const url = 'https://zephyrus/api/upload/';

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
                setUploadResponse(`${success}/${fileList.length} uploaded, ${fail} failed to process`);
                return response.json();
            }).then(responseBody => (
                responseBody
            )).catch(() => null);
        });
        dispatch(setReplayList([]));
    };

    const mainContent = (
        <div className="Upload">
            <ul className="Upload__info">
                <li className="Upload__info-item">
                    You can upload multiple replays
                </li>
                <li className="Upload__info-item">
                    The selected replays will be uploaded automatically
                </li>
                <li className="Upload__info-item">
                    Each replay will take a few seconds to upload and process
                </li>
                <li className="Upload__info-item">
                    Duplicate replays will be skipped automatically
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
            <p className="Upload__success">{uploadReponse}</p>
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
