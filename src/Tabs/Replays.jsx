import ProfileSection from '../Components/ProfileSection';
import ReplayList from '../Components/ReplayList';
import './CSS/Replays.css';

const Replays = () => {
    const pageTitle = 'Replays';

    const mainContent = (
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
    );

    const sideBar = (
        <div className="replay-info">
            <h1 className="replay-info__title">Match Summary</h1>
        </div>
    );

    return (
        <div className="Replays">
            <ProfileSection
                section="Replays"
                pageTitle={pageTitle}
                mainContent={mainContent}
                sideBar={sideBar}
            />
        </div>
    );
};


export default Replays;
