import PageTemplate from './General/PageTemplate';
import './Settings.css';

const Settings = () => {
    const pageTitle = 'Settings';
    const mainContent = null;
    const sideBar = null;

    return (
        <PageTemplate
            section="Settings"
            pageTitle={pageTitle}
            mainContent={mainContent}
            sideBar={sideBar}
        />
    );
};

export default Settings;
