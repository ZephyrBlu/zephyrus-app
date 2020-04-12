import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useFetch = (url, opts = null, dataKey = null, dep = '_default') => {
    const [_state, _setState] = useState(null);
    const [_prevDep, _setPrevDep] = useState('_default');
    const user = useSelector(state => state.user);

    useEffect(() => {
        // reset on logout
        if (!user) {
            _setState(null);
            _setPrevDep('_default');
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

        /*
          disallow requests if:
            - the user is logged out
            - the url is falsy
            - the dependency is falsy (Other than 0)
            - the dependency has not changed (Other than default)
        */
        if (user && url && (dep || dep === 0) && (dep !== _prevDep || dep === '_default')) {
            fetchData();
            _setPrevDep(dep);
        }

        return () => {
            controller.abort();
        };
    }, [user, url, dep]);

    // need to immediately check user condition since
    // useEffect runs post-render and so state change takes time to propagate
    return user ? _state : null;
};

export default useFetch;
