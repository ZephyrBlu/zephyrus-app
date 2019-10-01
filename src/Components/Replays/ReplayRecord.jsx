import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react';
import { setSelectedReplayHash } from '../../actions';
import './CSS/ReplayRecord.css';

const ReplayRecord = (props) => {
    const dispatch = useDispatch();
    const selectedReplayHash = useSelector(state => state.selectedReplayHash);

    const handleReplaySelection = async () => {
        dispatch(setSelectedReplayHash(props.hash));

        let url = `https://www.googleapis.com/storage/v1/b/sc2-timelines-dev/o/${props.hash}.json.gz?key=${props.apiKey}`;

        const metadata = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'gzip',
            },
        }).then(response => (
            response.json()
        )).then(responseBody => (
            responseBody
        )).catch(() => null);

        url = metadata.mediaLink;
        const data = await fetch(url, {
            method: 'GET',
        }).then(response => (
            response.json()
        )).then(responseBody => (
            responseBody
        )).catch(() => null);
        console.log(data);
    };

    const handleKeyDown = (key) => {
        if (key === 'Enter') {
            handleReplaySelection();
        }
    };

    const formatDate = (date) => {
        const formatString = () => {
            const strPieces = date.split('*');
            const [start] = strPieces;
            let fraction;

            switch (strPieces[1].slice(0, 1)) {
                case '1':
                    fraction = '\xBC';
                    break;

                case '2':
                    fraction = '\xBD';
                    break;

                case '3':
                    fraction = '\xBE';
                    break;

                default:
                    break;
            }
            return [start, fraction];
        };

        if (date.indexOf('*') !== -1) {
            const [start, fraction] = formatString();
            return `${start.trim()}${fraction} Months ago`;
        } else if (date.slice(1, 2) === 'm') {
            return `${date.slice(0, 1)} Months ago`;
        } else if (date.slice(1, 2) === 'w') {
            return `${date.slice(0, 1)} Weeks Ago`;
        } else if (date.slice(1, 2) === 'd') {
            return `${date.slice(0, 1)} Days Ago`;
        }
        return date;
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={
                selectedReplayHash && selectedReplayHash === props.hash ?
                    `ReplayRecord ReplayRecord--${props.stats.result.toLowerCase().split(',')[0]}-selected`
                    :
                    `ReplayRecord ReplayRecord--${props.stats.result.toLowerCase().split(',')[0]}`
            }
            onClick={() => handleReplaySelection()}
            onKeyDown={e => handleKeyDown(e.key)}
        >
            {Object.keys(props.stats).map(replayInfoField => (
                <span
                    key={`${replayInfoField}`}
                    className={`ReplayRecord__${replayInfoField}`}
                >
                    {replayInfoField === 'result' ?
                        <Fragment>
                            <span className={`ReplayRecord__stat--${
                                props.stats[replayInfoField].split(',')[0] === 'Win' ?
                                    'win' : 'loss'}`}
                            >
                                {props.stats[replayInfoField].split(',')[0]}
                            </span>
                            <span>
                                {props.stats[replayInfoField].split(',')[1]} min
                            </span>
                        </Fragment>
                        :
                        formatDate(props.stats[replayInfoField])
                    }
                </span>
            ))}
        </div>
    );
};

export default ReplayRecord;
