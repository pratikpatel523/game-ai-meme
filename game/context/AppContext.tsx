import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from 'react';
import { AppState, Action, Group, User, Meme } from '../types';

const GAME_STATE_KEY = 'aiMemeMadness_gameState';

const initialState: AppState = {
  user: null,
  groups: [],
  gameStarted: false,
  timerEndTime: null,
  winners: [],
  isAdmin: false,
};

const getInitialState = (): AppState => {
    try {
        const savedGameState = localStorage.getItem(GAME_STATE_KEY);
        if (savedGameState) {
            const { gameStarted, timerEndTime } = JSON.parse(savedGameState);
            // Ensure timer is not started for a past time
            if (gameStarted && timerEndTime && timerEndTime < Date.now()) {
                return initialState;
            }
            return { ...initialState, gameStarted, timerEndTime };
        }
    } catch (e) {
        console.error("Could not load game state from localStorage", e);
    }
    return initialState;
};

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CREATE_GROUP': {
      if (state.groups.length >= 8) return state; // MAX_GROUPS
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: action.payload.groupName,
        members: [action.payload.user],
        meme: undefined,
      };
      return { ...state, groups: [...state.groups, newGroup] };
    }
    case 'JOIN_GROUP': {
      return {
        ...state,
        groups: state.groups.map(g =>
          g.id === action.payload.groupId
            ? { ...g, members: [...g.members, action.payload.user] }
            : g
        ),
      };
    }
    case 'UPLOAD_MEME': {
        const { groupId, file, previewUrl } = action.payload;
        return {
            ...state,
            groups: state.groups.map(g => 
                g.id === groupId 
                ? { ...g, meme: { groupId, file, previewUrl } } 
                : g
            ),
        };
    }
    case 'DELETE_MEME': {
        return {
            ...state,
            groups: state.groups.map(g =>
                g.id === action.payload.groupId
                ? { ...g, meme: undefined }
                : g
            ),
        };
    }
    case 'START_GAME': {
      const newState = {
        ...state,
        gameStarted: true,
        timerEndTime: action.payload.timerEndTime,
        winners: [],
      };
      return newState;
    }
    case 'ADMIN_LOGIN':
      return { ...state, isAdmin: true };
    case 'ADMIN_LOGOUT':
      return { ...state, isAdmin: false, user: null };
    case 'SET_WINNERS':
        return { ...state, winners: action.payload };
    case 'RESET_GAME': {
        const newState = { ...initialState, isAdmin: state.isAdmin, user: state.isAdmin ? state.user : null };
        return newState;
    }
    case 'SYNC_GAME_STATE':
        const newState = {
            ...state,
            gameStarted: action.payload.gameStarted,
            timerEndTime: action.payload.timerEndTime,
        };
        return newState;
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Effect to sync state changes TO localStorage
  useEffect(() => {
    try {
        if (state.gameStarted && state.timerEndTime) {
            const gameState = {
                gameStarted: state.gameStarted,
                timerEndTime: state.timerEndTime,
            };
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        } else {
            // This handles the RESET_GAME case, ensuring sync across tabs
            if (localStorage.getItem(GAME_STATE_KEY)){
              localStorage.removeItem(GAME_STATE_KEY);
            }
        }
    } catch(e) {
        console.error("Could not save game state to localStorage", e);
    }
  }, [state.gameStarted, state.timerEndTime]);


  // Effect to sync state changes FROM localStorage (for other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === GAME_STATE_KEY) {
        if (event.newValue) {
          try {
            const payload = JSON.parse(event.newValue);
            dispatch({ type: 'SYNC_GAME_STATE', payload });
          } catch (e) {
            console.error("Error syncing state from localStorage", e);
          }
        } else {
          dispatch({ type: 'RESET_GAME' });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // This dependency array must be empty


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;