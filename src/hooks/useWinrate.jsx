import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWinrate } from '../actions';
import UrlContext from '../index';
import useFetch from './useFetch';

const useWinrate = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const urlPrefix = useContext(UrlContext);

    const defaultData = {
        protoss: { winrate: null },
        zerg: { winrate: null },
        terran: { winrate: null },
    };

    const [_cachedData, _setCachedData] = useState(defaultData);

    const protossWinrate = useFetch(`${urlPrefix}api/winrate/protoss/`);
    const zergWinrate = useFetch(`${urlPrefix}api/winrate/zerg/`);
    const terranWinrate = useFetch(`${urlPrefix}api/winrate/terran/`);

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
            if (_cachedData[race].winrate !== null) {
                updatedWinrate[race] = { winrate: JSON.parse(_cachedData[race].winrate) };
            }
        });
        dispatch(setWinrate(updatedWinrate));
    }, [_cachedData]);

    useEffect(() => {
        if (!user) {
            _setCachedData(defaultData);
        }
    }, [user]);
};

export default useWinrate;
