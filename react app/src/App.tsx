import React, { useEffect } from "react";
import "./App.scss";
import SideNav from "./components/SideNav";
import Chats from "./components/Chats";
import { useActions, useTypedSelector } from "./app/hooks";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Image from "./components/Image";
import StartNewChat from "./components/StartNewChat";
import { InitialiseAppAction } from "./app/action-creators";
import { useDispatch } from "react-redux";

function App() {
  const { DeauthAction } = useActions();
  const dispatch = useDispatch();
  const isLoggedIn = useTypedSelector((state) => state.appReducer.isLoggedIn);
  const toRegister = useTypedSelector((state) => state.appReducer.toRegister);
  const showProfile = useTypedSelector((state) => state.appReducer.showProfile);
  const showImage = useTypedSelector((state) => state.appReducer.showImage);
  const startNewChat = useTypedSelector((state) => state.appReducer.startNewChat);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(InitialiseAppAction());
    }
  }, [isLoggedIn, dispatch]);
  if (!localStorage.getItem("access_token")) DeauthAction();
  if (isLoggedIn)
    return (
      <div className="App">
        <SideNav />
        <div className="categoryWrapper">
          <Header />
          {showProfile && <Profile />}
          {showImage && <Image />}
          <Chats />
          {startNewChat && <StartNewChat />}
        </div>
      </div>
    );
  else if (toRegister) return <Register />;
  else return <Login />;
}

export default App;
