import axios from 'axios';
require('dotenv').config();
const baseURL = process.env.REACT_APP_BASE_URL;
const API = baseURL + '/users';

class UsersAPI{
    static async regitserUser(email, password){
        const body = {email: email, password: password};
        try{
            const response = await axios.post(API, body);
            return(response?.data);
        }
        catch(e){
            console.log(e);
            throw new Error("Failed to create an account.")
        }
    }
}
export default UsersAPI;
