import axios from 'axios';
import { REGISTER_FAIL,REGISTER_SUCCES } from "./type";
import {setAlert} from "./alert";
// REGISTER USER 

export const register= ({
    name,email,password
})=>async dispatch=>{
   const config= {  
    headers: {
        'Content-Type': 'application/json'
    }
}
const body= JSON.stringify({name,email,password});

try {
    const res = await axios.post('/api/users',body,config);

    dispatch({
        type: REGISTER_SUCCES,
        payload: res.data
    });
} catch (error) {
    const erros= error.response.data.errors;
    if(erros){
        erros.forEach(error=>dispatch(setAlert(error.msg,'danger')));
    }
    dispatch({
        type: REGISTER_FAIL
    });
}
}