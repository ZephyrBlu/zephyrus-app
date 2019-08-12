import PageHeader from '../Components/PageHeader';
import ReplayList from '../Components/ReplayList';
import './CSS/Replays.css';

const Replays = () => (
    <div className="Replays">
        <PageHeader pageTitle="Profile Overview" />
        <ReplayList
            replayList={[
                {
                    matchup: 'PvP',
                    'game-length': '10:38',
                    result: 'Win',
                    date: '10/08/19',
                    players: {
                        1: {
                            inGameName: 'User',
                            mmr: 4000,
                        },
                        2: {
                            inGameName: 'Opponent',
                            mmr: 4250,
                        },
                    },
                },
                {
                    matchup: 'PvZ',
                    'game-length': '10:38',
                    result: 'Loss',
                    date: '10/08/19',
                    players: {
                        1: {
                            inGameName: 'User',
                            mmr: 4000,
                        },
                        2: {
                            inGameName: 'Opponent',
                            mmr: 4250,
                        },
                    },
                },
            ]}
        />
        <section className="replay-info">
            <h1 className="replay-info__title">Match Summary</h1>
        </section>
    </div>
);


export default Replays;
