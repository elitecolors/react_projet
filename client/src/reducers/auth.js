import { REGISTER_FAIL,REGISTER_SUCCES } from "../actions/type";

const initState= {
    token : localStorage.getItem('token'),
    isAuth: null ,
    loading: true,
    user: null
}

export default function (state= initState,action){
    const {type,payload} = action;
    switch(type){
        case REGISTER_SUCCES:
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuth: true,
                loading : false
            }

            case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuth: false,
                loading : false
            }
            default: return state;

    }

}