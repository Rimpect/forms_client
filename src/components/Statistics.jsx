import React, { useEffect, useState } from 'react';

export function Statistics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost/forms/api/statistics.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setStats(data.stats);
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
    if (!stats) return null;

    return (
        <div>
            <h2>Статистика сайта</h2>
            <p>Всего пользователей: {stats.total_users}</p>
            <p>Зарегистрировано в этом месяце: {stats.month_users}</p>
            <p>Последний зарегистрированный пользователь: 
                {stats.last_user.first_name} {stats.last_user.last_name} 
                ({new Date(stats.last_user.created_at).toLocaleDateString()})
            </p>
        </div>
    );
}