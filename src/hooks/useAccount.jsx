import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialData, updateReplays } from '../actions';
import { handleFetch, updateUserAccount } from '../utils';
import { URL_PREFIX, RACES_LOWER } from '../constants';

const useAccount = (user) => {
    const dispatch = useDispatch();
    const accountData = useRef({});
    const [refetch, setRefetch] = useState(true);

    const defaultReplayCount = () => {
        const defaultState = {};
        RACES_LOWER.forEach((race) => {
            defaultState[race] = null;
        });
        return defaultState;
    };
    const replayCount = useRef(defaultReplayCount());

    const constructUrls = field => (
        RACES_LOWER.map(race => ({
            race,
            url: `${URL_PREFIX}api/${field}/${race}/`,
        }))
    );

    useEffect(() => {
        const dataFields = ['replays', 'winrate', 'stats', 'trends'];
        const dataUrls = {};
        dataFields.forEach((field) => {
            dataUrls[field] = constructUrls(field);
            accountData.current[field] = {};
        });

        const fetchData = async () => {
            const opts = { headers: { Authorization: `Token ${user.token}` } };
            await Promise.all(Object.entries(dataUrls).map(async ([field, urls]) => (
                Promise.all(urls.map(async (raceUrlObj) => {
                    const res = await handleFetch(raceUrlObj.url, opts);
                    const fieldData = res.ok ? res.data : false;

                    if (field === 'replays') {
                        replayCount.current[raceUrlObj.race] = fieldData.length;
                    }
                    accountData.current[field][raceUrlObj.race] = fieldData;

                    dispatch(setInitialData(
                        accountData.current[field][raceUrlObj.race],
                        field,
                        raceUrlObj.race,
                    ));
                }))
            )));
        };

        if (user && user.token) {
            updateUserAccount(user.token, URL_PREFIX, dispatch);
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        let pollInterval;
        if (user && user.token) {
            pollInterval = setInterval(async () => {
                const replayUrls = constructUrls('replays').map(raceUrlObj => `${raceUrlObj.url}count/`);
                const opts = { headers: { Authorization: `Token ${user.token}` } };

                await Promise.all(replayUrls.map(async (url) => {
                    const res = await handleFetch(url, opts);
                    const newReplayCount = res.ok ? res.data : false;

                    // indexOf('replays') give us index of start of 'replays/' in url
                    // +8 from that offset gives us the start of race name
                    // -7 offset from end removes 'count/' from the url
                    const race = url.slice(url.indexOf('replays') + 8, -7);

                    if (newReplayCount && newReplayCount !== replayCount.current[race]) {
                        // slice(0, -6) remove 'count/' from the url
                        const replayRes = await handleFetch(url.slice(0, -6), opts);
                        const newReplays = replayRes.ok ? replayRes.data : false;

                        if (newReplays) {
                            accountData.current.replays[race] = newReplays;
                            replayCount.current[race] = newReplayCount;
                            dispatch(updateReplays(
                                accountData.current.replays[race],
                                'replays',
                                race,
                            ));
                        }
                    }
                }));
                setRefetch(prevState => !prevState);
            }, 30000);
        }
        return () => clearInterval(pollInterval);
    }, [refetch, user]);
};

export default useAccount;
