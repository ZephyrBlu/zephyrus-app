import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Tippy from '@tippy.js/react';
import { setReplayList } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import './CSS/Upload.css';

const Upload = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);
    const [uploadReponse, setUploadResponse] = useState(null);
    const [hasAuthenticatedBattlenet, setAuthenticatedBattlenet] = useState(null);

    useEffect(() => {
        const checkBattlenetAccount = async () => {
            const url = 'http://127.0.0.1:8000/api/authorize/check/';

            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then(response => (
                response.status
            )).catch(() => null);

            if (result === 200) {
                setAuthenticatedBattlenet(true);
            } else {
                setAuthenticatedBattlenet(false);
            }
        };
        checkBattlenetAccount();
    }, []);

    const authorizeBattlenetAccount = async () => {
        const url = 'http://127.0.0.1:8000/api/authorize/url/';

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then(response => (
            response.status
        )).catch(() => null);

        if (result === 200) {
            setAuthenticatedBattlenet(true);
        }
    };

    const uploadFiles = async (event) => {
        const files = event.target.files;

        const fileList = [];
        Object.keys(files).forEach((fileNum) => {
            if (fileNum !== 'length') {
                fileList.push(files[fileNum]);
            }
        });

        const url = 'http://127.0.0.1:8000/api/upload/';

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
                    Duplicate uploads will be skipped
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
                    <Tippy
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
                        arrow
                    >
                        <svg
                            className="Upload__authorize-tooltip"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="25"
                            height="25"
                            viewBox="0 0 172 172"
                        >
                            <g
                                fill="none"
                                fillRule="nonzero"
                                stroke="none"
                                strokeWidth="1"
                                strokeLinecap="butt"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                                textAnchor="none"
                            >
                                <path
                                    d="M0,172v-172h172v172z"
                                    fill="none"
                                />
                                <g fill="#787878">
                                    <g id="surface1">
                                        <path
                                            d="M86,21.5c-35.56738,0 -64.5,28.93262 -64.5,64.5c0,35.56739 28.93262,64.5 64.5,64.5c35.56739,0 64.5,-28.93261 64.5,-64.5c0,-35.56738 -28.93261,-64.5 -64.5,-64.5zM86,32.25c29.75146,0 53.75,23.99854 53.75,53.75c0,29.75146 -23.99854,53.75 -53.75,53.75c-29.75146,0 -53.75,-23.99854 -53.75,-53.75c0,-29.75146 23.99854,-53.75 53.75,-53.75zM86,53.75c-11.8208,0 -21.5,9.6792 -21.5,21.5h10.75c0,-6.00488 4.74512,-10.75 10.75,-10.75c6.00489,0 10.75,4.74512 10.75,10.75c0,4.11523 -2.64551,7.76856 -6.55078,9.07031l-2.18359,0.67188c-4.38818,1.44873 -7.39062,5.64795 -7.39062,10.24609v6.88672h10.75v-6.88672l2.18359,-0.67187c8.27246,-2.75049 13.94141,-10.60303 13.94141,-19.31641c0,-11.8208 -9.6792,-21.5 -21.5,-21.5zM80.625,107.5v10.75h10.75v-10.75z"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </Tippy>
                </p>
                :
                <p className="Upload__authorize-message">
                    Verifying your Battlenet Account
                    <div className="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </p>)
            }
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
