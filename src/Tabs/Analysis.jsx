import ProfileSection from '../Components/ProfileSection';
import './CSS/Analysis.css';

const Analysis = () => {
    const pageTitle = 'Trend Analysis';
    const mainContent = (<h1>Main content goes here</h1>);
    const sideBar = (<h1>Side bar goes here</h1>);

    return (
        <div className="Analysis">
            <ProfileSection
                section="Analysis"
                pageTitle={pageTitle}
                mainContent={mainContent}
                sideBar={sideBar}
            />
        </div>
    );
};

export default Analysis;
