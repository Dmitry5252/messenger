import { Action } from "../actions";
import { ActionType } from "../action-types";
import { chat } from "../chatReducer/chatReducer";
import axios, { baseIP } from "../../config/axiosInstance";
import { Dispatch } from "react";
import { store } from "../store";

export const ChatsLoadedAction = (chats: chat[]): Action => ({ type: ActionType.CHATS_LOADED, payload: chats });

export const ChooseChatAction = (chosenChat: number): Action => ({ type: ActionType.CHOOSE_CHAT, payload: chosenChat });

export const InitialiseSocketAction = (socket: WebSocket): Action => ({ type: ActionType.INITIALISE_SOCKET, payload: socket });

export const DeauthAction = (): Action => ({ type: ActionType.DEAUTH });

export const AuthAction = (username: string, email: string, id: string): Action => ({ type: ActionType.AUTH, payload: { name: username, email, id } });

export const ToRegisterAction = (): Action => ({ type: ActionType.TOREGISTER });

export const ToLoginAction = (): Action => ({ type: ActionType.TOLOGIN });

export const RefreshAvatarAction = (): Action => ({ type: ActionType.REFRESH_AVATAR });

export const SetAnotherUserProfileAction = (anotherUser: boolean, username: string = "", id: string = ""): Action => ({ type: ActionType.SET_ANOTHER_USER_PROFILE, payload: { anotherUser, username, id } });

export const ShowProfileAction = (): Action => ({ type: ActionType.SHOW_PROFILE });

export const ShowImageAction = (imageName: string = "", imageSrc: string = "") => ({ type: ActionType.SHOW_IMAGE, payload: { imageName, imageSrc } });

export const StartNewChatAction = (): Action => ({ type: ActionType.START_NEW_CHAT });

export const NewChatAction = (username: string, id: string): Action => ({ type: ActionType.NEW_CHAT, payload: { username, id } });

export const NewChatSearchQueryAction = (query: string): Action => ({ type: ActionType.NEW_CHAT_SEARCH_QUERY, payload: query });

export const ToggleNotificationsAction = (): Action => ({ type: ActionType.TOGGLE_NOTIFICATIONS });

const createSocket = (dispatch: Dispatch<Action>) => {
  let socket = new WebSocket(`ws://${baseIP}/token=${localStorage.getItem("access_token")}`);
  const sound = new Audio("./notificationSound.mp3");
  socket.onmessage = (e) => {
    if (e.data === "Invalid token") {
      localStorage.removeItem("access_token");
      dispatch(DeauthAction());
    } else if (e.data.slice(0, 8) === "received") {
      if (store.getState().appReducer.notifications) {
        sound.play();
      }
      dispatch(ChatsLoadedAction(JSON.parse(e.data.slice(8))));
    } else {
      dispatch(ChatsLoadedAction(JSON.parse(e.data)));
    }
  };
  socket.onerror = (e) => {
    setTimeout(() => createSocket(dispatch), 10000);
  };
  dispatch(InitialiseSocketAction(socket));
};

export const InitialiseAppAction = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const response = await axios.get("auth", { headers: { access_token: localStorage.getItem("access_token") } });
      dispatch(AuthAction(response.data.name, response.data.email, response.data.id));
      createSocket(dispatch);
    } catch (e) {
      dispatch(DeauthAction());
    }
  };
};
