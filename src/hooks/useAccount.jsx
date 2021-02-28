import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateUserAccount } from '../utils';
import { URL_PREFIX } from '../constants';

const useAccount = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user ? state.user.token : null);

    useEffect(() => {
        updateUserAccount(token, URL_PREFIX, dispatch);
    }, [token]);
};

export default useAccount;
