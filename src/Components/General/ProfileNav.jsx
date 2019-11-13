import { Link } from '@reach/router';
import './CSS/ProfileNav.css';

const ProfileNav = (props) => {
    const isActive = ({ isCurrent }) => (
        isCurrent ?
            { className: 'ProfileNav__link ProfileNav__link--active' }
            :
            { className: 'ProfileNav__link' }
    );

    return (
        <nav className={`ProfileNav ProfileNav--${props.pages[0]}`}>
            {props.pages.map(pageName => (
                <Link
                    key={pageName}
                    getProps={isActive}
                    to={`/${pageName.toLowerCase()}`}
                >
                    {pageName}
                </Link>
            ))}
        </nav>
    );
};

export default ProfileNav;
