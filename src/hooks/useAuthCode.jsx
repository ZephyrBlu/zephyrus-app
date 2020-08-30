import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useContext } from 'react';
import { handleFetch, updateUserAccount } from '../utils';
import UrlContext from '../index';

const useAuthCode = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const urlPrefix = useContext(UrlContext);

    useEffect(() => {
        const setBattlenetAccount = async (authCode) => {
            const url = `${urlPrefix}api/authorize/code/`;
            const battlenetOpts = {
                method: 'POST',
                headers: { Authorization: `Token ${user.token}` },
                body: JSON.stringify({ authCode }),
            };
            const battlenetAccountResponse = await handleFetch(url, battlenetOpts);

            if (battlenetAccountResponse.ok) {
                updateUserAccount(user, dispatch, urlPrefix);
            }
        };

        if (user.token && localStorage.authCode) {
            setBattlenetAccount(localStorage.authCode);
            localStorage.removeItem('authCode');
        }
    }, []);
};

export default useAuthCode;
