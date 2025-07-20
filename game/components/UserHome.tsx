import React, { useState, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MAX_GROUPS } from '../constants';
import { User, Group } from '../types';

const UserHome: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { user, groups, gameStarted, timerEndTime } = state;
    const [userName, setUserName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isTimeUp = timerEndTime ? Date.now() > timerEndTime : false;

    const handleUserCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) {
            setError('Please enter your name.');
            return;
        }
        const newUser: User = { id: `user-${Date.now()}`, name: userName.trim() };
        dispatch({ type: 'SET_USER', payload: newUser });
        setError('');
    };

    const handleGroupCreate = () => {
        if (!groupName.trim()) {
            setError('Please enter a group name.');
            return;
        }
        if (groups.find(g => g.name.toLowerCase() === groupName.trim().toLowerCase())) {
            setError('A group with this name already exists.');
            return;
        }
        if (user) {
            dispatch({ type: 'CREATE_GROUP', payload: { groupName: groupName.trim(), user } });
            setGroupName('');
            setError('');
        }
    };

    const handleGroupJoin = (groupId: string) => {
        if (user) {
            dispatch({ type: 'JOIN_GROUP', payload: { groupId, user } });
        }
    };
    
    const handleMemeUpload = (e: React.ChangeEvent<HTMLInputElement>, groupId: string) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const previewUrl = URL.createObjectURL(file);
            const newFileName = `${groups.find(g => g.id === groupId)?.name}_meme.${file.name.split('.').pop()}`;
            const renamedFile = new File([file], newFileName, { type: file.type });
            dispatch({ type: 'UPLOAD_MEME', payload: { groupId, file: renamedFile, previewUrl } });
        } else {
            alert('Please upload a .jpg or .png file.');
        }
    };

    const handleMemeDelete = (groupId: string) => {
        dispatch({ type: 'DELETE_MEME', payload: { groupId } });
    }

    const userGroup = groups.find(g => g.members.some(m => m.id === user?.id));

    if (!user) {
        return (
            <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleUserCreate} className="bg-secondary p-8 rounded-lg shadow-xl border border-accent/20 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center text-highlight mb-6">Welcome to the Madness!</h2>
                    <p className="text-center text-dark-text mb-6">First, tell us your name.</p>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-primary p-3 rounded-md text-light border border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                     {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    <button type="submit" className="w-full bg-accent hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-md mt-6 transition-all duration-300">
                        Let's Go!
                    </button>
                </form>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in space-y-8">
            {!userGroup && (
            <div className="bg-secondary p-6 rounded-lg shadow-xl border border-accent/20">
                 <h3 className="text-xl font-bold text-highlight mb-4">Create or Join a Group</h3>
                 {groups.length < MAX_GROUPS && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="New group name..."
                            className="flex-grow bg-primary p-3 rounded-md text-light border border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button onClick={handleGroupCreate} className="bg-accent hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-md transition-all duration-300">
                            Create Group
                        </button>
                    </div>
                )}
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group: Group) => {
                    const isInGroup = group.members.some(m => m.id === user?.id);
                    const canJoin = !userGroup && group.members.length < 10; // arbitrary member limit

                    return (
                    <div key={group.id} className={`bg-secondary rounded-lg shadow-xl border-2 transition-all ${isInGroup ? 'border-highlight' : 'border-accent/20'}`}>
                        <div className="p-4 border-b border-accent/20">
                            <h4 className="font-bold text-lg truncate text-light">{group.name}</h4>
                            <p className="text-sm text-dark-text">{group.members.length} member(s)</p>
                        </div>
                        <div className="p-4 space-y-3">
                            <ul className="text-sm text-dark-text list-disc list-inside h-16 overflow-y-auto">
                                {group.members.map(m => <li key={m.id} className="truncate">{m.name}</li>)}
                            </ul>
                            
                             {isInGroup && gameStarted && !isTimeUp && (
                                <div className="mt-4">
                                {group.meme ? (
                                    <div className="space-y-2">
                                        <img src={group.meme.previewUrl} alt="Meme preview" className="rounded-md w-full object-cover"/>
                                        <button onClick={() => handleMemeDelete(group.id)} className="w-full text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md transition-all">
                                            Delete & Re-upload
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-accent/50 rounded-md">
                                        <input type="file" ref={fileInputRef} onChange={(e) => handleMemeUpload(e, group.id)} accept=".jpg,.jpeg,.png" className="hidden"/>
                                        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-highlight/80 hover:bg-highlight text-primary font-bold py-2 px-3 rounded-md transition-all">
                                            Upload Meme
                                        </button>
                                        <p className="text-xs text-dark-text mt-2">.jpg or .png</p>
                                    </div>
                                )}
                                </div>
                            )}

                             {isInGroup && !gameStarted && (
                                 <p className="text-center text-sm text-highlight/70 p-4 bg-primary/50 rounded-md">Waiting for admin to start the game...</p>
                             )}

                            {canJoin && (
                                <button onClick={() => handleGroupJoin(group.id)} className="w-full bg-accent hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md transition-all">
                                    Join
                                </button>
                            )}

                            {isTimeUp && group.meme && isInGroup && (
                                <>
                                 <img src={group.meme.previewUrl} alt="Meme preview" className="rounded-md w-full object-cover"/>
                                <p className="text-center text-sm text-red-400 p-2 bg-primary/50 rounded-md">Time's up! Submission locked.</p>
                                </>
                            )}
                             {isTimeUp && !group.meme && isInGroup && (
                                <p className="text-center text-sm text-red-500 p-2 bg-red-900/50 rounded-md">Time's up! No meme submitted.</p>
                             )}
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default UserHome;