import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleFetch, updateUserAccount } from '../utils';
import { URL_PREFIX } from '../constants';

const useAuthCode = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user ? state.user.token : null);

    useEffect(() => {
        const setBattlenetAccount = async (authCode) => {
            const url = `${URL_PREFIX}api/authorize/code/`;
            const battlenetOpts = {
                method: 'POST',
                headers: { Authorization: `Token ${token}` },
                body: JSON.stringify({ authCode }),
            };
            const battlenetAccountResponse = await handleFetch(url, battlenetOpts);

            if (battlenetAccountResponse.ok) {
                updateUserAccount(token, URL_PREFIX, dispatch);
            }
        };

        if (token && localStorage.authCode) {
            setBattlenetAccount(localStorage.authCode);
            localStorage.removeItem('authCode');
        }
    }, []);
};

export default useAuthCode;
