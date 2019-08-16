import { useSelector, useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import { setAuthToken } from '../../actions';
import './CSS/ProfileNav.css';

const ProfileNav = (props) => {
    let token;
    useSelector((state) => { token = `Token ${state.token}`; });

    const isActive = ({ isCurrent }) => (
        isCurrent ?
            { className: 'ProfileNav__link ProfileNav__link--active' }
            :
            { className: 'ProfileNav__link' }
    );

    const handleLogout = async () => {
        const url = 'http://127.0.0.1:8000/api/logout/';

        const error = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then(response => (
            response.status === 200 ? null : `${response.status} ${response.statusText}`
        ));

        if (error) {
            alert('Something went wrong. Please try to logout again');
        }

        useDispatch(setAuthToken(null));
    };

    return (
        <nav className={`ProfileNav ProfileNav--${props.pages[0]}`}>
            <Link
                getProps={isActive}
                to="/"
            >
                {props.pages[0]}
            </Link>
            {props.pages.slice(1).map(pageName => (
                <Link
                    key={pageName}
                    getProps={isActive}
                    to={`/${pageName.toLowerCase()}`}
                >
                    {pageName}
                </Link>
            ))}
            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default ProfileNav;
