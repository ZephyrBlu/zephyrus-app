import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setAuthToken } from '../actions';

const LoginForm = () => {
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    // update redux store with auth token
    const onGetToken = (token) => {
        useDispatch(setAuthToken(token));
    };

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();

        const loginUrl = 'http://127.0.0.1:8000/api/login/';

        const data = {
            username: usernameValue,
            password: passwordValue,
        };

        const error = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        }).then(responseBody => (
            onGetToken(responseBody.token)
        )).catch(requestError => (requestError));

        if (error) {
            alert('Your username and/or password were incorrect');
        }
    };

    return (
        <div>
            <h1>This will be a form</h1>
            <form onSubmit={handleSubmit} autoComplete="on">
                <label>
                    Email:
                    <input type="email" name="username" value={usernameValue} onChange={handleUsernameInput} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={passwordValue} onChange={handlePasswordInput} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default LoginForm;
