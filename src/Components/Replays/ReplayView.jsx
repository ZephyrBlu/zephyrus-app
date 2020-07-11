import { Fragment } from 'react';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../shared/StatCategory';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/ReplayView.css';
import useLoadingState from '../../useLoadingState';

const ReplayView = ({ replay, timeline, gameloop, clanTagIndex, visibleState }) => {
    const getPlayers = _replay => ({
        1: {
            name: _replay.data.players[1].name.slice(clanTagIndex(replay.data.players[1].name)),
            race: _replay.data.players[1].race,
            mmr: _replay.data.match_data.mmr[1],
        },
        2: {
            name: _replay.data.players[2].name.slice(clanTagIndex(replay.data.players[2].name)),
            race: _replay.data.players[2].race,
            mmr: _replay.data.match_data.mmr[2],
        },
    });

    const dataStates = {
        timeline: {
            INITIAL: null,
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({ _replay, _timeline, _gameloop, _getPlayers, _visibleState }) => (
                <TimelineArea
                    timeline={_timeline}
                    gameloop={_gameloop}
                    players={_getPlayers(_replay)}
                    visibleState={_visibleState}
                />
            ),
            ERROR: 'An error occurred',
        },
    };

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    // remove race from replay.info as it is non-standard and not displayed for post-game summary
    let replayInfo;
    if (replay.info) {
        const { race, ...filteredReplay } = replay.info;
        replayInfo = filteredReplay;
    }

    const loadingData = ({
        data: {
            _replay: replay,
            _timeline: timeline,
            _gameloop: gameloop,
            _getPlayers: getPlayers,
            _visibleState: visibleState,
        },
        loadingState: timeline.loading,
    });
    const TimelineState = useLoadingState(loadingData, dataStates.timeline);

    return (
        <Fragment>
            {replay.info &&
                <ReplayInfo
                    replay={replay.data}
                    timeline={{
                        stat: timeline.stat,
                        setStat: timeline.setStat,
                    }}
                    clanTagIndex={clanTagIndex}
                />}
            <TimelineState />
            <div className={`ReplayView${replay.info ? '' : '--default'}`}>
                {replay.info ?
                    <div className="ReplayView__stats">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                type="replays"
                                category={category}
                                replayInfo={replayInfo}
                            />
                        ))}
                    </div>
                    :
                    <h2 className="ReplayView__default">Select a replay to view</h2>}
            </div>
        </Fragment>
    );
};

export default ReplayView;
