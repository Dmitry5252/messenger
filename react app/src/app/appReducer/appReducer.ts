import { ActionType } from "../action-types";
import { Action } from "../actions";

export interface appState {
  isLoggedIn: boolean;
  toRegister: boolean;
  name: string;
  email: string;
  id: string;
  refreshAvatar: number;
  anotherUserName: string;
  anotherUserID: string;
  anotherUser: boolean;
  showProfile: boolean;
  showImage: boolean;
  imageSrc: string;
  imageName: string;
  startNewChat: boolean;
  notifications: boolean;
}

const initialState: appState = {
  isLoggedIn: true,
  toRegister: false,
  name: "",
  email: "",
  id: "",
  refreshAvatar: 0,
  anotherUserName: "",
  anotherUserID: "",
  anotherUser: false,
  showProfile: false,
  showImage: false,
  imageSrc: "",
  imageName: "",
  startNewChat: false,
  notifications: false,
};

const appReducer = (state: appState = initialState, action: Action): appState => {
  switch (action.type) {
    case ActionType.DEAUTH:
      return { ...state, isLoggedIn: false, name: "" };
    case ActionType.AUTH:
      return { ...state, isLoggedIn: true, name: action.payload.name, email: action.payload.email, id: action.payload.id };
    case ActionType.TOREGISTER:
      return { ...state, toRegister: true };
    case ActionType.TOLOGIN:
      return { ...state, toRegister: false };
    case ActionType.REFRESH_AVATAR:
      return { ...state, refreshAvatar: state.refreshAvatar + 1 };
    case ActionType.SET_ANOTHER_USER_PROFILE:
      return { ...state, anotherUser: action.payload.anotherUser, anotherUserName: action.payload.username, anotherUserID: action.payload.id };
    case ActionType.SHOW_PROFILE:
      return { ...state, showProfile: !state.showProfile };
    case ActionType.SHOW_IMAGE:
      if (state.showImage) {
        return { ...state, showImage: false, imageName: "", imageSrc: "" };
      } else {
        return { ...state, showImage: true, imageName: action.payload.imageName, imageSrc: action.payload.imageSrc };
      }
    case ActionType.START_NEW_CHAT:
      return { ...state, startNewChat: !state.startNewChat };
    case ActionType.TOGGLE_NOTIFICATIONS:
      return { ...state, notifications: !state.notifications };
    default:
      return state;
  }
};

export default appReducer;

export const appReducerType = typeof appReducer;
