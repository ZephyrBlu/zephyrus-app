import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from '../../actions';
import PageHeader from './PageHeader';
import './CSS/ProfileSection.css';

const ProfileSection = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);

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
        sessionStorage.clear();
        dispatch(setAuthToken(null));
    };

    return (
        <div className={`ProfileSection ProfileSection--${props.section}`}>
            <PageHeader
                pageTitle={props.pageTitle}
            />
            <section className="main-content">
                {props.mainContent}
            </section>

            <section className="side-bar">
                <div className="side-bar__content">
                    {props.sideBar}
                </div>
                <button className="side-bar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </section>
        </div>
    );
};

export default ProfileSection;
