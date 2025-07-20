
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const Timer: React.FC = () => {
    const { state } = useAppContext();
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!state.timerEndTime) {
            setTimeLeft({ minutes: 0, seconds: 0 });
            return;
        }

        const calculateTimeLeft = () => {
            const difference = state.timerEndTime! - Date.now();
            if (difference > 0) {
                return {
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());
        
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [state.timerEndTime]);
    
    const isEnding = timeLeft.minutes < 1;

    return (
        <div className={`text-lg font-bold p-2 rounded-md ${isEnding ? 'text-red-400 animate-pulse' : 'text-highlight'}`}>
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
    );
};

export default Timer;
