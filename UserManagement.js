import React, { useState, useEffect } from 'react';

const UserManagement = ({ activeUser, setActiveUser }) => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveUsers = async () => {
            // Simulate a call to an API to get active users
            const mockApiResponse = [
                { id: 1, username: 'User1' },
                { id: 2, username: 'User2' },
                { id: 3, username: 'User3' },
            ];
            setActiveUsers(mockApiResponse);
            setLoading(false);
        };

        fetchActiveUsers();
    }, []);

    const handleLogout = () => {
        // Clear the active user state
        setActiveUser(null);
        alert("You have been logged out.");
        localStorage.removeItem('token'); // Assuming there is a token in local storage
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1>Active Users</h1>
            {activeUsers.length > 0 ? (
                <ul>
                    {activeUsers.map((user) => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No active users available.</p>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserManagement;