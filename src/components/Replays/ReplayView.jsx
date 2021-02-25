import React from 'react';
import { useSelector } from 'react-redux';
import LoadingState from '../shared/LoadingState';
import ReplayInfo from './ReplayInfo';
import TimelineArea from './TimelineArea';
import StatCategory from '../shared/StatCategory';
import './CSS/ReplayView.css';

const ReplayView = ({ replay }) => {
    const visibleState = useSelector(state => state.visibleState);
    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    return (
        <div className={`ReplayView ReplayView--${visibleState ? 'replays' : 'no-replays'}`}>
            <LoadingState
                noLoad
                initial={
                    <h2 className="ReplayView__default">
                        Select a replay to view
                    </h2>
                }
                success={replay.data}
            >
                <ReplayInfo replay={replay} />
                <TimelineArea replay={replay} />
            </LoadingState>
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
