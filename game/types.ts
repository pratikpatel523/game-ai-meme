
export interface User {
  id: string;
  name: string;
}

export interface Meme {
  groupId: string;
  file: File;
  previewUrl: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  meme?: Meme;
}

export interface Winner {
    groupName: string;
    justification: string;
}

export interface AppState {
  user: User | null;
  groups: Group[];
  gameStarted: boolean;
  timerEndTime: number | null;
  winners: Winner[];
  isAdmin: boolean;
}

export type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CREATE_GROUP'; payload: { groupName: string; user: User } }
  | { type: 'JOIN_GROUP'; payload: { groupId: string; user: User } }
  | { type: 'UPLOAD_MEME'; payload: Meme }
  | { type: 'DELETE_MEME'; payload: { groupId: string } }
  | { type: 'START_GAME'; payload: { timerEndTime: number } }
  | { type: 'ADMIN_LOGIN' }
  | { type: 'ADMIN_LOGOUT' }
  | { type: 'SET_WINNERS'; payload: Winner[] }
  | { type: 'RESET_GAME' }
  | { type: 'SYNC_GAME_STATE'; payload: { gameStarted: boolean; timerEndTime: number | null } };