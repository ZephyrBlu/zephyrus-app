import { useState } from 'react';
import ReplayRecord from './ReplayRecord';
import './CSS/ReplayList.css';

const ReplayList = (props) => {
    const [selectedReplay, setSelectedReplay] = useState(null);

    const changeReplaySelection = (newReplaySelection) => {
        setSelectedReplay(newReplaySelection);
    };

    const checkSelection = (mu) => {
        if (selectedReplay === mu) {
            return true;
        }
        return false;
    };

    return (
        <section className="ReplayList">
            {props.replayList.map((replayInfo, index) => (
                <ReplayRecord
                    key={`replay-${index}`}
                    identifier={selectedReplay}
                    summary={{ ...replayInfo }}
                    selected={checkSelection(replayInfo.matchup)}
                    onReplaySelection={changeReplaySelection}
                />
            ))}
        </section>
    );
};

export default ReplayList;
