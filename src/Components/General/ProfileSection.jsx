import PageHeader from './PageHeader';
import './CSS/ProfileSection.css';

const ProfileSection = props => (
    <div className={`ProfileSection ProfileSection--${props.section}`}>
        <PageHeader
            pageTitle={props.pageTitle}
            handleToken={props.handleToken}
        />
        <section className="main-content">
            {props.mainContent}
        </section>

        <section className="side-bar">
            {props.sideBar}
        </section>
    </div>
);

export default ProfileSection;
