
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Timer from './Timer';

const Header: React.FC = () => {
    const { state } = useAppContext();

    return (
        <header className="w-full bg-secondary p-4 shadow-lg flex justify-between items-center z-10">
            <div className="flex items-center space-x-3">
                <div className="text-highlight text-3xl">🎮</div>
                <h1 className="text-2xl md:text-3xl font-black tracking-wider text-light">
                    AI Meme Madness
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                {state.gameStarted && !state.isAdmin && (
                    <Timer />
                )}
                {!state.isAdmin && (
                    <Link to="/login" className="bg-accent hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md transition-all text-sm">
                        Admin Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
