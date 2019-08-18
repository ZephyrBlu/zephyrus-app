import { useDispatch, useSelector } from 'react-redux';
import { setSelectedReplayHash } from '../../actions';
import './CSS/ReplayRecord.css';

const ReplayRecord = (props) => {
    const dispatch = useDispatch();
    const selectedReplayHash = useSelector(state => state.selectedReplayHash);

    const handleReplaySelection = () => {
        dispatch(setSelectedReplayHash(props.hash));
    };

    const handleKeyDown = (key) => {
        if (key === 'Enter') {
            handleReplaySelection();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={
                selectedReplayHash && selectedReplayHash === props.hash ?
                    `ReplayRecord ReplayRecord--${props.stats.result.toLowerCase()}-selected`
                    :
                    `ReplayRecord ReplayRecord--${props.stats.result.toLowerCase()}`
            }
            onClick={() => handleReplaySelection()}
            onKeyDown={e => handleKeyDown(e.key)}
        >
            {Object.keys(props.stats).map(replayInfoField => (
                <span
                    key={`${replayInfoField}`}
                    className={`ReplayRecord__${replayInfoField}`}
                >
                    {replayInfoField === 'gameLength' ?
                        `${props.stats[replayInfoField]} min` : props.stats[replayInfoField]
                    }
                </span>
            ))}
        </div>
    );
};

export default ReplayRecord;
