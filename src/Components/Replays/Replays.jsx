import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setReplays } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
import './CSS/Replays.css';

const Replays = () => {
    let token;
    useSelector((state) => { token = `Token ${state.token}`; });

    useEffect(() => {
        const getUserReplays = async () => {
            const url = 'http://127.0.0.1:8000/api/all/';

            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                responseBody
            )).catch(() => (null));

            if (data) {
                useDispatch(setReplays(data));
            } else {
                alert('Something went wrong. Try again');
            }
        };
        getUserReplays();
    }, []);

    useSelector(state => console.log(state.replayList));

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
