import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useFetch = (url, dep = 'default', dataKey = null, opts = null) => {
    const user = useSelector(state => state.user);
    const [_state, _setState] = useState(null);

    useEffect(() => {
        // reset on logout
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
                    console.error(`${response.status} ${response.statusText}`);
                    _setState(false);
                }
            } catch (error) {
                console.error(error);
                _setState(false);
            }
        };

        /*
          disallow requests if:
            - the user is logged out
            - the url is falsy
            - the dependency is falsy (Other than 0)
        */
        if (user && url && (dep || dep === 0)) {
            fetchData();
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
