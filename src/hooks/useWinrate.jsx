import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWinrate } from '../actions';
import { URL_PREFIX } from '../constants';
import useFetch from './useFetch';

const useWinrate = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const userData = useSelector(state => state.raceData);

    const defaultData = {
        protoss: { winrate: null },
        zerg: { winrate: null },
        terran: { winrate: null },
    };

    const [_cachedData, _setCachedData] = useState(defaultData);

    const protossWinrate = useFetch(`${URL_PREFIX}api/winrate/protoss/`);
    const zergWinrate = useFetch(`${URL_PREFIX}api/winrate/zerg/`);
    const terranWinrate = useFetch(`${URL_PREFIX}api/winrate/terran/`);

    if (protossWinrate !== _cachedData.protoss.winrate) {
        _setCachedData(prevData => ({
            ...prevData,
            protoss: { winrate: protossWinrate },
        }));
    }
    if (zergWinrate !== _cachedData.zerg.winrate) {
        _setCachedData(prevData => ({
            ...prevData,
            zerg: { winrate: zergWinrate },
        }));
    }
    if (terranWinrate !== _cachedData.terran.winrate) {
        _setCachedData(prevData => ({
            ...prevData,
            terran: { winrate: terranWinrate },
        }));
    }

    useEffect(() => {
        const updatedWinrate = {};
        const races = ['protoss', 'zerg', 'terran'];

        races.forEach((race) => {
            if (
                _cachedData[race].winrate !== null
                && !userData[race].winrate
            ) {
                updatedWinrate[race] = { winrate: JSON.parse(_cachedData[race].winrate) };
            }
        });
        if (Object.keys(updatedWinrate).length > 0) {
            dispatch(setWinrate(updatedWinrate));
        }
    }, [_cachedData]);

    useEffect(() => {
        if (!user) {
            _setCachedData(defaultData);
        }
    }, [user]);
};

export default useWinrate;
