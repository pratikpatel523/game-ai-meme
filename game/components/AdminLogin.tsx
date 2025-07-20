
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            dispatch({ type: 'ADMIN_LOGIN' });
            dispatch({ type: 'SET_USER', payload: { id: 'admin-user', name: 'Admin' } });
            navigate('/admin');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <div className="w-full max-w-md">
                <form onSubmit={handleLogin} className="bg-secondary p-8 rounded-lg shadow-xl border border-accent/20">
                    <h2 className="text-3xl font-bold text-center text-highlight mb-2">Admin Login</h2>
                    <p className="text-center text-dark-text mb-8">Access the control dashboard</p>
                    
                    <div className="mb-4">
                        <label className="block text-dark-text text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            className="w-full bg-primary p-3 rounded-md text-light border border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    
                    <div className="mb-6">
                         <label className="block text-dark-text text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••"
                            className="w-full bg-primary p-3 rounded-md text-light border border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}

                    <button type="submit" className="w-full bg-accent hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-md transition-all duration-300">
                        Log In
                    </button>

                    <button type="button" onClick={() => navigate('/')} className="w-full mt-4 text-center text-dark-text hover:text-highlight transition-colors">
                        Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
