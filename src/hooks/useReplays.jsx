import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useContext } from 'react';
import { setReplayInfo, setReplays } from '../actions';
import UrlContext from '../index';
import useFetch from './useFetch';

const useReplays = (interval) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const selectedRace = useSelector(state => state.selectedRace);
    const urlPrefix = useContext(UrlContext);

    const defaultCount = { protoss: null, zerg: null, terran: null };
    const defaultData = {
        protoss: { replays: null, count: null },
        zerg: { replays: null, count: null },
        terran: { replays: null, count: null },
    };

    const [_prevCount, _setPrevCount] = useState(defaultCount);
    const [_cachedData, _setCachedData] = useState(defaultData);
    const [intervalState, flipIntervalState] = useState('flip');

    const protossCount = useFetch(`${urlPrefix}api/replays/protoss/count/`, intervalState);
    const zergCount = useFetch(`${urlPrefix}api/replays/zerg/count/`, intervalState);
    const terranCount = useFetch(`${urlPrefix}api/replays/terran/count/`, intervalState);

    const protossReplays = useFetch(`${urlPrefix}api/replays/protoss/`, protossCount);
    const zergReplays = useFetch(`${urlPrefix}api/replays/zerg/`, zergCount);
    const terranReplays = useFetch(`${urlPrefix}api/replays/terran/`, terranCount);

    // if count changes then replays must also change, therefore we only need to check replays
    // could make this more efficient by only setting data that has changed
    if (protossReplays !== _cachedData.protoss.replays) {
        _setCachedData(prevData => ({
            ...prevData,
            protoss: { replays: protossReplays, count: protossCount },
        }));
    }
    if (zergReplays !== _cachedData.zerg.replays) {
        _setCachedData(prevData => ({
            ...prevData,
            zerg: { replays: zergReplays, count: zergCount },
        }));
    }
    if (terranReplays !== _cachedData.terran.replays) {
        _setCachedData(prevData => ({
            ...prevData,
            terran: { replays: terranReplays, count: terranCount },
        }));
    }

    useEffect(() => {
        const updatedReplays = {};
        const races = ['protoss', 'zerg', 'terran'];

        races.forEach((race) => {
            if (_cachedData[race].count !== _prevCount[race]) {
                const raceReplays = _cachedData[race].replays;
                updatedReplays[race] = { replays: raceReplays };
            }
        });

        // update cached replay counts for next replay data update
        const newCount = {};
        Object.keys(updatedReplays).forEach((race) => { newCount[race] = _cachedData[race].count; });
        _setPrevCount(prevCount => ({ ...prevCount, ...newCount }));

        // if the replays we're currently viewing are being changed then
        // clear displayed data and show loading indicator
        if (updatedReplays[selectedRace]) {
            dispatch(setReplayInfo([]));
        }
        dispatch(setReplays(updatedReplays));
    }, [_cachedData]);

    useEffect(() => {
        // flipping interval state triggers count useFetch hooks to fire again
        let pollInterval;
        if (user) {
            pollInterval = setInterval(() => {
                flipIntervalState(prevState => (prevState === 'flip' ? 'flop' : 'flip'));
            }, interval);
        } else {
            _setPrevCount(defaultCount);
            _setCachedData(defaultData);
        }
        return () => clearInterval(pollInterval);
    }, [user]);
};

export default useReplays;
