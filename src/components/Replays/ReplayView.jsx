import React from 'react';
import { useSelector } from 'react-redux';
import { useLoadingState } from '../../hooks';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../shared/StatCategory';
import './CSS/ReplayView.css';

const ReplayView = ({ replay }) => {
    const visibleState = useSelector(state => state.visibleState);
    const dataStates = {
        replay: {
            INITIAL: (
                <h2 className="ReplayView__default">
                    Select a replay to view
                </h2>
            ),
            SUCCESS: ({ _replay }) => (
                <ReplayInfo replay={_replay} />
            ),
        },
    };

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const replayLoadingData = {
        data: { _replay: replay },
        loadingState: replay.loading,
    };
    const ReplayState = useLoadingState(replayLoadingData, dataStates.replay);

    return (
        <div className={`ReplayView ReplayView--${visibleState ? 'replays' : 'no-replays'}`}>
            <ReplayState />
            <TimelineArea replay={replay} />
            <div className="ReplayView__summary-stats">
                {replay.info &&
                    <div className="ReplayView__stats">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                category={category}
                                replay={replay}
                            />
                        ))}
                    </div>}
            </div>
        </div>
    );
};

export default ReplayView;
