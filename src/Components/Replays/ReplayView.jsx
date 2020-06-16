import { Fragment } from 'react';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../shared/StatCategory';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/ReplayView.css';

const ReplayView = ({ replay, timeline, gameloop, clanTagIndex, visibleState }) => {
    const getPlayers = () => ({
        1: {
            name: replay.data.players[1].name.slice(clanTagIndex(replay.data.players[1].name)),
            race: replay.data.players[1].race,
            mmr: replay.data.match_data.mmr[1],
        },
        2: {
            name: replay.data.players[2].name.slice(clanTagIndex(replay.data.players[2].name)),
            race: replay.data.players[2].race,
            mmr: replay.data.match_data.mmr[2],
        },
    });

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    let timelineArea;
    if (replay.hash) {
        if (timeline.data) {
            timelineArea = (
                <TimelineArea
                    timeline={timeline}
                    gameloop={gameloop}
                    players={getPlayers()}
                    visibleState={visibleState}
                />
            );
        } else {
            timelineArea = timeline.error ? 'An error occured' : <LoadingAnimation />;
        }
    }

    // remove race from replay.info as it is non-standard and not displayed for post-game summary
    let replayInfo;
    if (replay.info) {
        const { race, ...filteredReplay } = replay.info;
        replayInfo = filteredReplay;
    }

    return (
        <Fragment>
            {replay.info &&
                <ReplayInfo
                    replay={replay.data}
                    clanTagIndex={clanTagIndex}
                />}
            {timelineArea}
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
