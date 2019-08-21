import './CSS/PageInfo.css';

const PageInfo = (props) => (
    <div className="PageInfo">
        <h2 className="PageInfo__site-name">zephyrus</h2>
        <h3 className="PageInfo__info">
            StarCraft II &nbsp;/&nbsp; {props.pageTitle}
        </h3>
    </div>
);

export default PageInfo;
