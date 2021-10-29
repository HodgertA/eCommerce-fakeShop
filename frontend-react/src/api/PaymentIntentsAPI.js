import axios from 'axios';
require('dotenv').config();

const baseURL = process.env.REACT_APP_BASE_URL;
const API = baseURL + '/paymentIntents';

class LoginAPI{
    static async createPaymentIntent(amount){
        const body = {amount: (amount*100)};
        try{
            const response = await axios.post(API, body);
            return(response?.data);
        }
        catch(e){
            console.log(e);
        }
    }
}
export default LoginAPI;