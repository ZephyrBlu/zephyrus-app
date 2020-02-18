import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setReplays, setReplayCount, setReplayInfo } from './actions';

const useReplayPolling = (interval) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);

    const getReplayCount = (data) => {
        const count = {};
        Object.entries(data).forEach(([race, info]) => {
            count[race] = info.count;
        });
        return count;
    };
    const replayCount = useSelector(state => getReplayCount(state.raceData));

    let urlPrefix;
    if (process.env.NODE_ENV === 'development') {
        urlPrefix = 'http://127.0.0.1:8000/';
    } else {
        urlPrefix = 'https://zephyrus.gg/';
    }

    const getUserReplays = async (race) => {
        const url = `${urlPrefix}api/replays/${race}/`;
        let status;

        const data = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then((response) => {
            status = response.status;
            return response.json();
        }).then(responseBody => (
            responseBody
        )).catch(() => null);
        if (status === 200) {
            return data;
        }
        return null;
    };

    const pollReplays = () => {
        const races = ['protoss', 'zerg', 'terran'];
        races.forEach(async (race) => {
            const countUrl = `${urlPrefix}api/replays/${race}/count/`;
            let countStatus;
            const countResponse = await fetch(countUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            }).then((response) => {
                countStatus = response.status;
                return response.json();
            }).catch(() => null);

            if (countStatus === 200 && countResponse !== replayCount[race]) {
                dispatch(setReplayInfo([]));
                const updatedReplays = await getUserReplays(race);
                if (updatedReplays) {
                    dispatch(setReplays(updatedReplays, race));
                    dispatch(setReplayCount(countResponse, race));
                }
            }
        });
    };

    useEffect(() => {
        let replayPolling;
        if (token) {
            replayPolling = setInterval(pollReplays, interval);
        }

        return () => {
            clearInterval(replayPolling);
        };
    }, [token, replayCount]);
};

export default useReplayPolling;
