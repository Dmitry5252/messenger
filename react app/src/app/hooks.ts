import { bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import * as actionCreators from "./action-creators";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useActions = () => bindActionCreators(actionCreators, useAppDispatch());
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
