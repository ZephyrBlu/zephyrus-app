import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext } from 'react';
import { updateUserAccount } from '../utils';
import UrlContext from '../index';

const useAccount = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const urlPrefix = useContext(UrlContext);

    useEffect(() => {
        if (user && user.token) {
            updateUserAccount(user, dispatch, urlPrefix);
        }
    }, [user]);
};

export default useAccount;
