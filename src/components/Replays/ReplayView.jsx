import React, { Fragment } from 'react';
import { useLoadingState } from '../../hooks';
import ReplayInfo from './ReplayInfo';
import ReplaySummary from './ReplaySummary';
import TimelineArea from './TimelineArea';
// import StatCategory from '../shared/StatCategory';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/ReplayView.css';

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
        replay: {
            INITIAL: (
                <h2 className="ReplayView__default">
                    Select a replay to view
                </h2>
            ),
            SUCCESS: ({ _replay, _timeline, _clanTagIndex }) => (
                <ReplayInfo
                    replay={_replay}
                    timeline={{
                        stat: _timeline.stat,
                        setStat: _timeline.setStat,
                    }}
                    clanTagIndex={_clanTagIndex}
                />
            ),
        },
        timeline: {
            INITIAL: null,
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({ _replay, _timeline, _gameloop, _getPlayers, _visibleState }) => (
                <Fragment>
                    <ReplaySummary
                        replay={_replay}
                        timeline={_timeline}
                    />
                    <TimelineArea
                        metrics={_replay.metrics}
                        replay={_replay}
                        timeline={_timeline}
                        gameloop={_gameloop}
                        players={_getPlayers(_replay)}
                        visibleState={_visibleState}
                    />
                </Fragment>
            ),
            ERROR: 'An error occurred',
        },
    };

    // const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    // remove race from replay.info as it is non-standard and not displayed for post-game summary
    // let replayInfo;
    // if (replay.info) {
    //     const { race, ...filteredReplay } = replay.info;
    //     replayInfo = filteredReplay;
    // }

    const replayLoadingData = {
        data: {
            _replay: replay,
            _timeline: timeline,
            _clanTagIndex: clanTagIndex,
        },
        loadingState: replay.loading,
    };
    const ReplayState = useLoadingState(replayLoadingData, dataStates.replay);

    const timelineLoadingData = ({
        data: {
            _replay: replay,
            _timeline: timeline,
            _gameloop: gameloop,
            _getPlayers: getPlayers,
            _visibleState: visibleState,
        },
        loadingState: timeline.loading,
    });
    const TimelineState = useLoadingState(timelineLoadingData, dataStates.timeline);

    return (
        <div className={`ReplayView ReplayView--${visibleState ? 'replays' : 'no-replays'}`}>
            <ReplayState />
            <TimelineState />
            {/* <div className={`ReplayView${replay.data ? '' : '--default'}`}>
                {replay.data &&
                    <div className="ReplayView__stats">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                type="replays"
                                category={category}
                                replayInfo={replayInfo}
                            />
                        ))}
                    </div>}
            </div> */}
        </div>
    );
};

export default ReplayView;
