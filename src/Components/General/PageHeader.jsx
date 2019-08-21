import PageInfo from './PageInfo';
import ProfileNav from './ProfileNav';
import './CSS/PageHeader.css';

const PageHeader = props => (
    <header className={`PageHeader PageHeader--${props.pageTitle}`}>
        <PageInfo pageTitle={props.pageTitle} />
        <h1 className="PageHeader__page-title">{props.pageTitle}</h1>
        {!props.noNav &&
        <ProfileNav
            pages={['Overview', 'Replays', 'Analysis']}
        />}
    </header>
);

export default PageHeader;
