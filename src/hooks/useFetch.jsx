import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useFetch = (url, dep = 'default', dataKey = null, opts = null) => {
    const token = useSelector(state => (state.user ? state.user.token : null));
    const [_state, _setState] = useState(null);

    useEffect(() => {
        // reset on logout
        _setState(null);
    }, [token, url, dep]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            const requestOpts = opts || { headers: { Authorization: `Token ${token}` } };
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
                console.error(error.toString());
                if (error.name !== 'AbortError') {
                    _setState(false);
                }
            }
        };

        /*
          disallow requests if:
            - the user is logged out
            - the url is falsy
            - the dependency is falsy (Other than 0)
        */
        if (token && url && (dep || dep === 0)) {
            fetchData();
        } else if (url === false || dep === false) {
            _setState(false);
        }

        return () => {
            controller.abort();
        };
    }, [token, url, dep]);

    // need to immediately check user condition since
    // useEffect runs post-render and so state change takes time to propagate
    return token ? _state : null;
};

export default useFetch;
