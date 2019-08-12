import './CSS/ReplayRecord.css';

const ReplayRecord = (props) => {
    const handleReplaySelection = () => {
        props.onReplaySelection(props.summary.matchup);
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
                props.selected ?
                    `ReplayRecord ReplayRecord--${props.summary.result.toLowerCase()}-selected`
                    :
                    `ReplayRecord ReplayRecord--${props.summary.result.toLowerCase()}`
            }
            onClick={() => handleReplaySelection()}
            onKeyDown={e => handleKeyDown(e.key)}
        >
            {Object.keys(props.summary).map(replayInfoField => (
                <span className={`ReplayRecord__${replayInfoField}`}>
                    {typeof (props.summary[replayInfoField]) === 'object' ?
                        Object.keys(props.summary[replayInfoField]).map(dataKey => (
                            Object.values(props.summary[replayInfoField][dataKey]).map(value => (
                                `${value} `
                            ))
                        ))
                        :
                        props.summary[replayInfoField]
                    }
                </span>
            ))}
        </div>
    );
};

export default ReplayRecord;
