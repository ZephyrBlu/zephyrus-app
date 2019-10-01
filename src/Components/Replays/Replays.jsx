import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState, useEffect } from 'react';
import { setReplayList, setReplayInfo } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import ReplayList from './ReplayList';
import StatCategory from '../General/StatCategory';
import DefaultResponse from '../General/DefaultResponse';
import WaveAnimation from '../General/WaveAnimation';
import './CSS/Replays.css';

const selectData = createSelector(
    state => `Token ${state.token}`,
    state => state.apiKey,
    state => state.replayList,
    state => state.replayInfo,
    state => state.selectedReplayHash,
    (token, apiKey, userReplays, replayInfo, selectedReplayHash) => (
        [token, apiKey, userReplays, replayInfo, selectedReplayHash]
    ),
);

const Replays = () => {
    const dispatch = useDispatch();
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [selectedReplayInfo, setSelectedReplayInfo] = useState(null);
    const [token, apiKey, userReplays, replayInfo, selectedReplayHash] = useSelector(selectData);

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

    useEffect(() => {
        const getUserReplays = async () => {
            const url = 'http://127.0.0.1:8000/api/all/';
            let status;

            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then((response) => {
                status = response.status;
                return response.json();
            }).then(responseBody => (
                responseBody
            )).catch(() => null);

            if (status === 200) {
                dispatch(setReplayList(data));
            } else {
                dispatch(setReplayList(false));
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
                    map: replay.map,
                    result: `${replay.win ? 'Win' : 'Loss'},\xa0\xa0\xa0\xa0${Math.ceil(replay.match_length / 60)}`,
                    date: replay.played_at.slice(0, 10),
                    player1: `${replay.players[1].name.slice(clanTagIndex(replay.players[1].name))},
                    ${replay.match_data.mmr[1] === 0 ? '' : replay.match_data.mmr[1]}`,
                    player2: `${replay.players[2].name.slice(clanTagIndex(replay.players[2].name))},
                    ${replay.match_data.mmr[2] === 0 ? '' : replay.match_data.mmr[2]}`,
                };
                newReplays.push(currentReplayInfo);
            });
            dispatch(setReplayInfo(newReplays));
        };

        if (userReplays && (userReplays.length > 0)) {
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

        if (userReplays && (userReplays.length > 0)) {
            getSelectedReplay();
        }
    }, [selectedReplayHash]);

    useEffect(() => {
        const filterSelectedReplayInfo = () => {
            const infoList = { user_match_id: selectedReplay.user_match_id };
            Object.entries(selectedReplay.match_data).forEach(([stat, values]) => {
                infoList[stat] = values;
            });
            setSelectedReplayInfo(infoList);
        };
        if (selectedReplay) {
            filterSelectedReplayInfo();
        }
    }, [selectedReplay]);

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const pageTitle = 'Replays';

    const mainContent = (
        <div className={`replay-info${selectedReplayInfo ? '' : '--default'}`}>
            {!selectedReplayInfo && <h2 className="replay-info__default">Select a replay to view</h2>}
            {selectedReplayInfo &&
                <div className="replay-info__stats">
                    <div className="replay-info__title-area">
                        <h2 className="replay-info__matchup">
                            {`${selectedReplay.players[1].race.slice(0, 1)}v${selectedReplay.players[2].race.slice(0, 1)}`}
                        </h2>
                        <h2 className="replay-info__map">
                            {selectedReplay.map}
                        </h2>
                        <span className="replay-info__date">
                            {selectedReplay.played_at.slice(0, 1)} Months Ago
                        </span>
                        <span className="replay-info__result">
                            {selectedReplay.win ?
                                <span className="replay-info__result--win">Win</span>
                                :
                                <span className="replay-info__result--loss">Loss</span>
                            }
                            {`\xa0\xa0\xa0\xa0${Math.ceil(selectedReplay.match_length / 60)} min`}
                        </span>
                        <div className="replay-info__players">
                            <div
                                className={
                                    `replay-info__player-info replay-info__player-info--player1
                                    ${selectedReplay.user_match_id === 1 ? 'replay-info__player-info--user' : ''}`
                                }
                            >
                                <h2 className="replay-info__player-name">
                                    {selectedReplay.players[1].name.slice(clanTagIndex(selectedReplay.players[1].name))}
                                </h2>
                                <span className="replay-info__player-details">
                                    {selectedReplay.match_data.mmr[1]}&nbsp;&nbsp;&nbsp;Player 1
                                </span>
                            </div>
                            <div
                                className={
                                    `replay-info__player-info replay-info__player-info--player2
                                    ${selectedReplay.user_match_id === 2 ? 'replay-info__player-info--user' : ''}`
                                }
                            >
                                <h2 className="replay-info__player-name">
                                    {selectedReplay.players[2].name.slice(clanTagIndex(selectedReplay.players[2].name))}
                                </h2>
                                <span className="replay-info__player-details">
                                    {selectedReplay.match_data.mmr[2]}&nbsp;&nbsp;&nbsp;Player 2
                                </span>
                            </div>
                        </div>
                    </div>
                    {statCategories.map(category => (
                        <StatCategory
                            key={category}
                            type="replays"
                            category={category}
                            replayInfo={selectedReplayInfo}
                        />
                    ))}
                </div>}
        </div>
    );

    let sideBar;

    if (userReplays) {
        sideBar = (
            replayInfo.length > 0 ?
                <ReplayList replayList={replayInfo} apiKey={apiKey} />
                :
                <WaveAnimation />
        );
    } else {
        sideBar = (<DefaultResponse />);
    }

    return (
        <div className="Replays">
            <ProfileSection
                section="Replays"
                pageTitle={pageTitle}
                mainContent={mainContent}
                sideBar={sideBar}
                modifier="replays"
            />
        </div>
    );
};

export default Replays;
