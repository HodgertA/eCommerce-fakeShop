import axios from 'axios';
require('dotenv').config();
const baseURL = process.env.REACT_APP_BASE_URL;
const API = baseURL + '/orders/';

class OrdersAPI{
    static async processCheckout(paymentMethodId, cartItems, shippingData, amount, token){
        let headers= "";
        if (token) {
            headers = {
                'Authorization': `Bearer ${token}`
            };
        }
        
        const body = {
            paymentMethodId: paymentMethodId,
            cartItems: cartItems,
            shippingData: shippingData,
            amount: (amount*100),
        };
        try{
            const response = await axios.post(API, body, {headers: headers});
            return(response?.data);
        }
        catch(e){
            console.log(e);
            if(e.response){
                return {error: e.response.data};
            }
            else {
                return {error: "Unexpected error. If your card has been charged and you did not recieve a confimation email, please contact us."}
            }
            
        }
    }

    static async getOrders(token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        try{
            const response = await axios.get(API, {headers: headers});
            return (response?.data);
        }
        catch(e){
            console.log(e);
        }
    }

    static async getOrderDetails(orderId, token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const url = API + orderId;

        try {
            const response = await axios.get(url, {headers: headers});
            return (response?.data);
        }
        catch(e){
            console.log(e);
        }
    }
}
export default OrdersAPI;