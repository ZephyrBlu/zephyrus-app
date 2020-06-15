import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTrends } from './actions';
import UrlContext from './index';
import useFetch from './useFetch';

const useTrends = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const urlPrefix = useContext(UrlContext);

    const defaultData = {
        protoss: { trends: null },
        zerg: { trends: null },
        terran: { trends: null },
    };

    const [_cachedData, _setCachedData] = useState(defaultData);

    const protossTrends = useFetch(`${urlPrefix}api/stats/protoss/`);
    const zergTrends = useFetch(`${urlPrefix}api/stats/zerg/`);
    const terranTrends = useFetch(`${urlPrefix}api/stats/terran/`);

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
            if (_cachedData[race].trends !== null) {
                updatedTrends[race] = { trends: JSON.parse(_cachedData[race].trends) };
            }
        });
        dispatch(setTrends(updatedTrends));
    }, [_cachedData]);

    useEffect(() => {
        if (!user) {
            _setCachedData(defaultData);
        }
    }, [user]);
};

export default useTrends;
