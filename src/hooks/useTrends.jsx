import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTrends } from '../actions';
import { URL_PREFIX } from '../constants';
import useFetch from './useFetch';

const usePerformance = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const userData = useSelector(state => state.raceData);

    const defaultData = {
        protoss: { trends: null },
        zerg: { trends: null },
        terran: { trends: null },
    };

    const [_cachedData, _setCachedData] = useState(defaultData);

    const protossTrends = useFetch(`${URL_PREFIX}api/trends/protoss/`);
    const zergTrends = useFetch(`${URL_PREFIX}api/trends/zerg/`);
    const terranTrends = useFetch(`${URL_PREFIX}api/trends/terran/`);

    if (protossTrends !== _cachedData.protoss.trends) {
        _setCachedData(prevData => ({
            ...prevData,
            protoss: { trends: protossTrends },
        }));
    }
    if (zergTrends !== _cachedData.zerg.trends) {
        _setCachedData(prevData => ({
            ...prevData,
            zerg: { trends: zergTrends },
        }));
    }
    if (terranTrends !== _cachedData.terran.trends) {
        _setCachedData(prevData => ({
            ...prevData,
            terran: { trends: terranTrends },
        }));
    }

    useEffect(() => {
        const updatedTrends = {};
        const races = ['protoss', 'zerg', 'terran'];

        races.forEach((race) => {
            if (
                _cachedData[race].trends !== null
                && !userData[race].trends
            ) {
                updatedTrends[race] = { trends: JSON.parse(_cachedData[race].trends) };
            }
        });

        if (Object.keys(updatedTrends).length > 0) {
            dispatch(setTrends(updatedTrends));
        }
    }, [_cachedData]);

    useEffect(() => {
        if (!user) {
            _setCachedData(defaultData);
        }
    }, [user]);
};

export default usePerformance;
