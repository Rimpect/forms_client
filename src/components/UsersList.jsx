import React, { useEffect, useState } from 'react';

export function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/lab_2/api/users', {
          credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setUsers(data.users);
                } else {
                    setError(data.message);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Список пользователей</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.last_name} {user.first_name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}