import PageInfo from './PageInfo';
import ProfileNav from './ProfileNav';
import './CSS/PageHeader.css';

const PageHeader = props => (
    <header className="PageHeader">
        <PageInfo />
        <h1 className="PageHeader__page-title">{props.pageTitle}</h1>
        <ProfileNav
            pages={['Overview', 'Replays', 'Analysis']}
            handleToken={props.handleToken}
        />
    </header>
);

export default PageHeader;
