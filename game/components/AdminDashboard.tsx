import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { judgeMemes } from '../services/geminiService';
import { GAME_DURATION_MINUTES } from '../constants';
import Timer from './Timer';
import Spinner from './Spinner';
import Modal from './Modal';
import { Winner } from '../types';

const AdminDashboard: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { groups, gameStarted, timerEndTime, winners } = state;
    const [isJudging, setIsJudging] = useState(false);
    const [judgingError, setJudgingError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    
    const isTimeUp = timerEndTime ? Date.now() > timerEndTime : false;
    const submittedMemes = groups.filter(g => g.meme);
    const allMemesSubmitted = groups.length > 0 && submittedMemes.length === groups.length;


    const handleStartGame = () => {
        const newTimerEndTime = Date.now() + GAME_DURATION_MINUTES * 60 * 1000;
        dispatch({ type: 'START_GAME', payload: { timerEndTime: newTimerEndTime } });
    };
    
    const handleJudge = async () => {
        if (submittedMemes.length === 0) {
            alert('No memes have been submitted for judging.');
            return;
        }
        setIsJudging(true);
        setJudgingError('');
        try {
            const memesToJudge = submittedMemes.map(g => g.meme!);
            const aiWinners = await judgeMemes(memesToJudge);
            dispatch({ type: 'SET_WINNERS', payload: aiWinners });
            setIsModalOpen(true);
        } catch (error) {
            setJudgingError(error instanceof Error ? error.message : 'An unknown error occurred.');
            setIsModalOpen(true);
        } finally {
            setIsJudging(false);
        }
    };
    
    const handleReset = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    const handleLogout = () => {
        dispatch({ type: 'ADMIN_LOGOUT' });
        navigate('/');
    };

    return (
        <div className="p-6 bg-primary min-h-screen text-light">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-highlight">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleReset} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-all">Reset Game</button>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-all">Logout</button>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-secondary p-6 rounded-lg shadow-xl mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">Game Controls</h2>
                        <p className="text-dark-text">Start the timer and initiate judging.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {gameStarted && (
                            <div className="flex items-center space-x-2 bg-primary/50 p-2 rounded-lg">
                                <span className="text-dark-text font-semibold">Time Left:</span>
                                <Timer />
                            </div>
                        )}
                        {!gameStarted ? (
                            <button onClick={handleStartGame} disabled={groups.length === 0} className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-md transition-all text-lg">
                                Start Game
                            </button>
                        ) : (
                            <button onClick={handleJudge} disabled={(!isTimeUp && !allMemesSubmitted) || isJudging} className="bg-accent hover:bg-opacity-80 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-md transition-all text-lg flex items-center justify-center space-x-2 w-48">
                                {isJudging ? <Spinner size="sm" /> : <span>Judge with AI</span>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Submissions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Submissions ({submittedMemes.length}/{groups.length} groups)</h2>
                    {groups.length === 0 ? (
                         <p className="text-dark-text text-center py-10">No groups have been created yet.</p>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groups.map(group => (
                            <div key={group.id} className="bg-secondary rounded-lg shadow-lg overflow-hidden">
                                <div className="p-4 border-b border-accent/20">
                                    <h3 className="font-bold text-lg text-light truncate">{group.name}</h3>
                                    <p className="text-sm text-dark-text">{group.members.map(m => m.name).join(', ')}</p>
                                </div>
                                <div className="p-4 h-64 flex items-center justify-center">
                                    {group.meme ? (
                                        <img src={group.meme.previewUrl} alt={`Meme from ${group.name}`} className="max-w-full max-h-full object-contain rounded-md" />
                                    ) : (
                                        <p className="text-dark-text">No submission</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={judgingError ? "Error" : "🏆 AI Judging Results 🏆"}>
                {judgingError ? (
                    <p className="text-red-400">{judgingError}</p>
                ) : (
                    <div className="space-y-6">
                        {winners.map((winner: Winner, index) => (
                            <div key={index} className="p-4 rounded-lg bg-primary border border-accent/30">
                                <h3 className="text-2xl font-bold text-highlight mb-2">
                                    {index === 0 ? "🥇 1st Place:" : "🥈 2nd Place:"} {winner.groupName}
                                </h3>
                                <p className="text-dark-text italic">"{winner.justification}"</p>
                            </div>
                        ))}
                         {winners.length === 0 && <p className="text-light">The AI could not determine a winner. Please try again.</p>}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;