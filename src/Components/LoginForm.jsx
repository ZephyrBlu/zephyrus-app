import { useState } from 'react';

const LoginForm = (props) => {
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    const onGetToken = (token) => {
        props.handleToken(token);
        props.navigate('/');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginUrl = 'http://127.0.0.1:8000/api/login/';

        let token;
        let error;
        const data = {
            username: usernameValue,
            password: passwordValue,
        };

        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors',
        }).then((resp) => {
            token = resp.json();
        }).catch((e) => {
            token = null;
            error = e;
        });

        if (token) {
            onGetToken(token);
        } else if (token === null) {
            alert(`The request failed due to ${error}`);
        } else {
            alert('The username and/or password entered were invalid');
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
