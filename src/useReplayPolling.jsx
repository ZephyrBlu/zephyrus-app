import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useContext } from 'react';
import { setReplayInfo, setRaceData } from './actions';
import UrlContext from './index';
import useFetch from './useFetch';

const useReplayPolling = (interval) => {
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

    const protossCount = useFetch(`${urlPrefix}api/replays/protoss/count/`, null, null, intervalState);
    const zergCount = useFetch(`${urlPrefix}api/replays/zerg/count/`, null, null, intervalState);
    const terranCount = useFetch(`${urlPrefix}api/replays/terran/count/`, null, null, intervalState);

    const protossReplays = useFetch(`${urlPrefix}api/replays/protoss/`, null, null, protossCount);
    const zergReplays = useFetch(`${urlPrefix}api/replays/zerg/`, null, null, zergCount);
    const terranReplays = useFetch(`${urlPrefix}api/replays/terran/`, null, null, terranCount);

    // if count changes then replays must also change, therefore we only need to check replays
    // could make this more efficient by only setting data that has changed
    if ((protossReplays !== _cachedData.protoss.replays) || (zergReplays !== _cachedData.zerg.replays) || (terranReplays !== _cachedData.terran.replays)) {
        _setCachedData({
            protoss: { replays: protossReplays, count: protossCount },
            zerg: { replays: zergReplays, count: zergCount },
            terran: { replays: terranReplays, count: terranCount },
        });
    }

    useEffect(() => {
        const updatedReplays = {};
        const races = ['protoss', 'zerg', 'terran'];

        races.forEach((race) => {
            if (_cachedData[race].replays && _cachedData[race].count !== _prevCount[race]) {
                const raceReplays = _cachedData[race].replays.length > 0 ?
                    _cachedData[race].replays :
                    false;
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
        dispatch(setRaceData(updatedReplays));
    }, [_cachedData]);

    useEffect(() => {
        // flipping interval state triggers count useFetch hooks to fire again
        let pollInterval;
        if (user) {
            pollInterval = setInterval(
                flipIntervalState(prevState => (prevState === 'flip' ? 'flop' : 'flip')),
                interval,
            );
        } else {
            _setPrevCount(defaultCount);
            _setCachedData(defaultData);
        }
        return () => clearInterval(pollInterval);
    }, [user]);
};

export default useReplayPolling;
