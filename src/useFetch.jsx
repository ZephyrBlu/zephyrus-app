import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useFetch = (url, opts = null, dataKey = null, deps = true) => {
    const [_state, _setState] = useState(null);
    const user = useSelector(state => state.user);

    if (!Array.isArray(deps)) {
        deps = [deps];
    }

    useEffect(() => {
        if (!user) {
            _setState(null);
        }
    }, [user]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            const requestOpts = opts || { headers: { Authorization: `Token ${user.token}` } };
            try {
                const response = await fetch(url, {
                    ...requestOpts,
                    signal,
                });
                if (response.ok) {
                    const data = await response.json();
                    _setState(dataKey ? data[dataKey] : data);
                } else {
                    throw new Error(`status ${response.status}`);
                }
            } catch (error) {
                _setState(false);
            }
        };

        if (user && url && (deps[0] || deps[0] === 0)) {
            fetchData();
        }

        return () => {
            controller.abort();
            _setState(null);
        };
    }, [user, url, ...deps]);

    // need to immediately check user condition since
    // useEffect runs post-render and so state change takes time to propagate
    return user ? _state : null;
};

export default useFetch;
