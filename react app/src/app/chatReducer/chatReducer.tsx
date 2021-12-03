import { ActionType } from "../action-types";
import { Action } from "../actions";

export interface chatState {
  id: string;
  chats: chat[];
  chosenChat: number | null;
  socket: WebSocket | null;
  chatSearchQuery: string;
}

export interface message {
  text: string;
  received: 1 | 0;
  date: string;
  type: "text" | "image" | "file";
  fileName: string;
  src: string;
}

export interface chat {
  username: string;
  id: string;
  messages: message[];
}

const initialState: chatState = {
  id: "",
  chats: [],
  chosenChat: null,
  socket: null,
  chatSearchQuery: "",
};

const sortChats = (payload: chat[]) => payload.sort((a, b) => (b.messages[0] && a.messages[0] ? Date.parse(b.messages[b.messages.length - 1].date) - Date.parse(a.messages[a.messages.length - 1].date) : -1));

const chooseSortedChat = (chosenChat: number | null, payload: chat[], state: chatState) => (chosenChat != null ? sortChats(payload).findIndex((e) => e.id === state.chats[chosenChat].id) : null);

const chatReducer = (state: chatState = initialState, action: Action): chatState => {
  switch (action.type) {
    case ActionType.CHATS_LOADED:
      const chats = action.payload.map((e) => (e.id === state.id ? { ...e, username: "Saved messages" } : e));

      return { ...state, chats: sortChats(chats), chosenChat: chooseSortedChat(state.chosenChat, chats, state) };
    case ActionType.CHOOSE_CHAT:
      return { ...state, chosenChat: action.payload };
    case ActionType.INITIALISE_SOCKET:
      return { ...state, socket: action.payload };
    case ActionType.NEW_CHAT:
      const newChats = state.chats;
      newChats.unshift({ username: action.payload.username, id: action.payload.id, messages: [] });
      return { ...state, chats: newChats };
    case ActionType.NEW_CHAT_SEARCH_QUERY:
      return { ...state, chatSearchQuery: action.payload };
    case ActionType.AUTH:
      return { ...state, id: action.payload.id };
    default:
      return state;
  }
};

export default chatReducer;

export const chatReducerType = typeof chatReducer;
