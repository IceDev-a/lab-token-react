import { combineReducers } from "redux";
import counter from "redux/slices/counter";
import web3 from "./slices/web3";

const rootReducer = combineReducers({ counter, web3 });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
