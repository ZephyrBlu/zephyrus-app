import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, Fragment } from 'react';
import { setReplays } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
import './CSS/Replays.css';

const Replays = () => {
    const dispatch = useDispatch();
    const [replayInfo, setReplayInfo] = useState([]);
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const token = useSelector(state => `Token ${state.token}`);
    const userReplays = useSelector(state => state.replayList);
    const selectedReplayHash = useSelector(state => state.selectedReplayHash);

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
                dispatch(setReplays(data));
            } else {
                alert('Something went wrong. Try again');
            }
        };

        if (userReplays.length < 1) {
            getUserReplays();
        }
    }, []);

    useEffect(() => {
        const filterReplayInfo = () => {
            const newReplays = [];
            userReplays.forEach((replay) => {
                const currentReplayInfo = {
                    fileHash: replay.file_hash,
                    matchup: `${replay.players[1].race.slice(0, 1)}v${replay.players[2].race.slice(0, 1)}`,
                    gameLength: Math.ceil(replay.match_length / 60),
                    result: replay.win ? 'Win' : 'Loss',
                    date: replay.played_at.slice(0, 10),
                    player1: `${replay.players[1].name.slice(replay.players[1].name.indexOf('>') === -1 ?
                        0 : replay.players[1].name.indexOf('>') + 1)},
                    ${replay.match_data.mmr[1] === 0 ? '' : replay.match_data.mmr[1]}`,
                    player2: `${replay.players[2].name.slice(replay.players[2].name.indexOf('>') === -1 ?
                        0 : replay.players[2].name.indexOf('>') + 1)},
                    ${replay.match_data.mmr[2] === 0 ? '' : replay.match_data.mmr[2]}`,
                };
                newReplays.push(currentReplayInfo);
            });
            setReplayInfo(newReplays);
        };

        if (userReplays.length > 0) {
            filterReplayInfo();
        }
    }, [userReplays]);

    useEffect(() => {
        const getSelectedReplay = () => {
            userReplays.forEach((replay) => {
                if (replay.file_hash === selectedReplayHash) {
                    setSelectedReplay(replay);
                }
            });
        };

        if (userReplays.length > 0) {
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    useEffect(() => {
        const statNames = {
            apm: 'APM',
            workers_produced: 'Workers Produced',
            workers_lost: 'Workers Lost',
            avg_unspent_resources: 'Avg Unspent Resources',
            avg_resource_collection_rate: 'Avg Collection Rate',
        };

        const filterSelectedReplayInfo = () => {
            console.log(selectedReplay);
            const infoList = {};
            Object.entries(selectedReplay.match_data).forEach(([stat, values]) => {
                if (stat in statNames) {
                    if ('minerals' in values) {
                        const newValues = {
                            1: `${Math.ceil(values.minerals[1])}/${Math.ceil(values.gas[1])}`,
                            2: `${Math.ceil(values.minerals[2])}/${Math.ceil(values.gas[2])}`,
                        };
                        infoList[statNames[stat]] = newValues;
                    } else {
                        infoList[statNames[stat]] = values;
                    }
                }
            });
            setSelectedReplayInfo(infoList);
        };
        if (selectedReplay) {
            filterSelectedReplayInfo();
        }
    }, [selectedReplay]);

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

    const pageTitle = 'Replays';

    const mainContent = (
        <ReplayList
            replayList={replayInfo}
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
