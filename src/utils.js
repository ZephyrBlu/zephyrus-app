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
        let data;

        if (response.ok) {
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
