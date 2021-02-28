import { setUser } from './actions';

export const handleFetch = async (url, opts = {}, timeoutMs = 60000) => { // eslint-disable-line import/prefer-default-export
    const handleError = (err) => {
        console.error(err);
        return { ok: false };
    };

    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, timeoutMs);
    });

    const request = fetch(url, opts).then(async (response) => {
        const { status, ok } = response;
        let data = null;

        if (ok) {
            try {
                data = await response.json();
            } catch (error) {
                if (error instanceof SyntaxError) {
                    data = null;
                } else {
                    throw error;
                }
            }
        } else {
            data = false;
            console.error(`${response.status} ${response.statusText}`);
        }

        return {
            data,
            status,
            ok,
        };
    });

    return Promise.race([request, timeout]).catch(handleError);
};

export const updateUserAccount = async (token, prefix, dispatch) => {
    if (!token) {
        return;
    }

    const url = `${prefix}api/authorize/check/`;
    const opts = {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
    };
    const updatedUser = await handleFetch(url, opts);

    if (updatedUser.ok && localStorage.user !== JSON.stringify(updatedUser.data.user)) {
        dispatch(setUser(updatedUser.data.user));
        localStorage.user = JSON.stringify(updatedUser.data.user);
    }
};

export const clanTagIndex = name => (
    name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
);

export const capitalize = str => (
    str.charAt(0).toUpperCase() + str.slice(1)
);
