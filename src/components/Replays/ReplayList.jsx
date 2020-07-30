import ReplayRecord from './ReplayRecord';
import './CSS/ReplayList.css';

const ReplayList = ({ replays }) => (
    <section className="ReplayList">
        {replays.map((replayInfo) => {
            const stats = replayInfo;
            const { fileHash, ...newStats } = stats;

            return (
                <ReplayRecord
                    key={fileHash}
                    hash={fileHash}
                    stats={newStats}
                />
            );
        })}
    </section>
);

export default ReplayList;
