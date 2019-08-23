import { useSelector, useDispatch } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import { setAuthToken } from './actions';
import Login from './Components/Login';
import Replays from './Components/Replays/Replays';
import Analysis from './Components/Analysis/Analysis';
import Upload from './Components/Upload/Upload';
import './ProfileApp.css';

const ProfileApp = () => {
    const dispatch = useDispatch();
    let token = useSelector(state => state.token);
    if (sessionStorage.token && !token) {
        token = sessionStorage.token;
        dispatch(setAuthToken(token));
    }

    let app;
    if (token) {
        app = (
            <Router>
                <Redirect from="/login" to="/replays" />
                <Upload
                    pageTitle="Upload Replays"
                    path="/upload"
                />
                <Replays
                    pageTitle="Replays"
                    path="/replays"
                />
                <Analysis
                    pageTitle="Trend Analysis"
                    path="/analysis"
                />
            </Router>
        );
    } else {
        app = (
            <Router>
                <Redirect from="/*" to="/login" />
                <Login
                    path="/login"
                />
            </Router>
        );
    }

    return (
        <div className="ProfileApp">
            {app}
        </div>
    );
};

export default ProfileApp;
