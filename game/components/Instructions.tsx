
import React from 'react';

const Instructions: React.FC = () => {
    return (
        <div className="bg-secondary p-6 rounded-lg shadow-xl animate-fade-in border border-accent/20">
            <h2 className="text-2xl font-bold text-highlight mb-4 flex items-center">
                <span className="text-3xl mr-3">⏱️</span> Game Instructions
            </h2>
            <div className="space-y-4 text-dark-text">
                <div>
                    <h3 className="font-bold text-lg text-light mb-1">👥 Group Formation (Max 8 Groups)</h3>
                    <p>Enter your name, then either create a new group or join an existing one. Each group can submit only one meme but can replace it before the timer ends.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-light mb-1">🎯 Objective</h3>
                    <p>Create a funny, creative, and AI-related meme about how AI is impacting your professional or personal life.</p>
                </div>
                 <div>
                    <h3 className="font-bold text-lg text-light mb-1">🛠️ Meme Generators (Optional)</h3>
                    <p>Use any free online tool, like <a href="https://imgflip.com/memegenerator" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">imgflip.com</a>, <a href="https://canva.com" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">Canva</a>, or <a href="https://kapwing.com/meme-maker" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">Kapwing</a>.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-light mb-1">📤 Submission</h3>
                    <p>Save your meme as a .jpg or .png. Upload it using the form for your group. The deadline is 20 minutes after the admin starts the game.</p>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
