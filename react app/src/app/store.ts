import appReducer from "./appReducer/appReducer";
import chatReducer from "./chatReducer/chatReducer";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const reducers = combineReducers({ appReducer, chatReducer });

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducers>;
