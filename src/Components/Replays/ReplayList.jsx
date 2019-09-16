import ReplayRecord from './ReplayRecord';
import './CSS/ReplayList.css';

const ReplayList = props => (
    <section className="ReplayList">
        {props.loading ?
            props.loading
            :
            props.replayList.map((replayInfo) => {
                const stats = replayInfo;
                const { fileHash, ...newStats } = stats;

                return (
                    <ReplayRecord
                        key={fileHash}
                        hash={fileHash}
                        stats={newStats}
                    />
                );
            })
        }
    </section>
);

export default ReplayList;
