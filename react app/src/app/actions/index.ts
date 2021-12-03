import { ActionType } from "../action-types";
import { chat } from "../chatReducer/chatReducer";

interface ChatsLoadedAction {
  type: ActionType.CHATS_LOADED;
  payload: chat[];
}

interface ChooseChatAction {
  type: ActionType.CHOOSE_CHAT;
  payload: number | null;
}

interface InitialiseSocketAction {
  type: ActionType.INITIALISE_SOCKET;
  payload: WebSocket;
}

interface DeauthAction {
  type: ActionType.DEAUTH;
}

interface AuthAction {
  type: ActionType.AUTH;
  payload: { name: string; email: string; id: string };
}

interface ToRegisterAction {
  type: ActionType.TOREGISTER;
}

interface ToLoginAction {
  type: ActionType.TOLOGIN;
}

interface RefreshAvatarAction {
  type: ActionType.REFRESH_AVATAR;
}

interface SetAnotherUserProfileAction {
  type: ActionType.SET_ANOTHER_USER_PROFILE;
  payload: { anotherUser: boolean; username: string; id: string };
}

interface ShowProfileAction {
  type: ActionType.SHOW_PROFILE;
}

interface ShowImageAction {
  type: ActionType.SHOW_IMAGE;
  payload: { imageName: string; imageSrc: string };
}

interface StartNewChatAction {
  type: ActionType.START_NEW_CHAT;
}

interface NewChatAction {
  type: ActionType.NEW_CHAT;
  payload: { username: string; id: string };
}

interface NewChatSearchQueryAction {
  type: ActionType.NEW_CHAT_SEARCH_QUERY;
  payload: string;
}

interface ToggleNotificationsAction {
  type: ActionType.TOGGLE_NOTIFICATIONS;
}

export type Action = ChatsLoadedAction | ChooseChatAction | InitialiseSocketAction | DeauthAction | AuthAction | ToRegisterAction | ToLoginAction | RefreshAvatarAction | SetAnotherUserProfileAction | ShowProfileAction | ShowImageAction | StartNewChatAction | NewChatAction | NewChatSearchQueryAction | ToggleNotificationsAction;
