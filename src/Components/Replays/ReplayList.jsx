import ReplayRecord from './ReplayRecord';
import './CSS/ReplayList.css';

const ReplayList = props => (
    <section className="ReplayList">
        {props.replayList.map((replayInfo) => {
            const stats = replayInfo;
            const { fileHash, ...newStats } = stats;

            return (
                <ReplayRecord
                    key={fileHash}
                    apiKey={props.apiKey}
                    hash={fileHash}
                    stats={newStats}
                />
            );
        })}
    </section>
);

export default ReplayList;
