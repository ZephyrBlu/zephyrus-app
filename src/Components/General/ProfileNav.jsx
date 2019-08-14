import { Link, navigate } from '@reach/router';
import './CSS/ProfileNav.css';

const ProfileNav = (props) => {
    const isActive = ({ isCurrent }) => (
        isCurrent ?
            { className: 'ProfileNav__link ProfileNav__link--active' }
            :
            { className: 'ProfileNav__link' }
    );

    const handleApiCall = async () => {
        const url = 'http://127.0.0.1:8000/api/all/';
        // const token = `Token ${sessionStorage.token}`;
        // console.log(token);
        const data = { auth: sessionStorage.token };

        let result;
        fetch(url, {
            method: 'POST',
            headers: {

            },
            body: JSON.stringify(data),
        }).then(response => (
            response.json()
        )).then((payload) => {
            console.log(payload);
            result = payload;
        });

        console.log(result);
    };

    const handleLogout = () => {
        const url = 'http://127.0.0.1:8000/api/logout/';

        const result = fetch(url, {
            method: 'GET',
        }).then(response => (
            response.json()
        )).then(payload => (
            payload.response
        ));

        console.log(result);

        sessionStorage.clear();
        navigate('/login');
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
            <button onClick={handleApiCall}>
                Send Request
            </button>
            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default ProfileNav;
