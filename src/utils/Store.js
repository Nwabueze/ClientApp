import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
    darkMode: Cookies.get('darkMode')  === 'ON' ? true : false,
    userInfo: Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null,

}

function reducer(state, action){
    switch(action.type){
        case "DARK_MODE_ON":
            return {...state, darkMode: true};
        case "DARK_MODE_OFF":
            return {...state, darkMode: false};
        case "USER_LOGIN": 
            return {...state, userData: action.payload };
        case "USER_LOGOUT": 
            return {...state, userData: null, };
        default:
            return state;
    }
}

export function StoreProvider(props){
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
