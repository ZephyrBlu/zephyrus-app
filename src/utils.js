export const handleFetch = async (url, opts = {}) => ( // eslint-disable-line import/prefer-default-export
    fetch(url, opts).then(async (response) => {
        if (response.ok) {
            const result = await response.json();
            return result || true;
        }
        console.error(`${response.status} ${response.statusText}`);
        return false;
    }).catch((err) => {
        console.error(err);
        return false;
    })
);
