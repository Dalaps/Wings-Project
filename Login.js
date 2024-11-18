import React, { useState } from 'react';

const Login = ({ setActiveUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSection, setShowSection] = useState('login');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setActiveUser(data.user);
                localStorage.setItem('token', data.token);
                alert("Login successful!");
            } else {
                setErrorMessage(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please try again.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, password: newPassword, email: newEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Sign-up successful! You can now log in.");
                setShowSection('login');
            } else {
                setErrorMessage(data.message || 'Sign up failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Error during sign up. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>{showSection === 'signUp' ? "Sign Up" : "Login"} to Wings Cafe</h1>
            {showSection === 'signUp' ? (
                <form onSubmit={handleSignUp}>
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New Username" required />
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
                    <button type="submit">Sign Up</button>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={() => setShowSection(showSection === 'login' ? 'signUp' : 'login')}>
                {showSection === 'signUp' ? "Already a user? Log in here" : "New user? Sign Up here"}
            </button>
        </div>
    );
};

export default Login;