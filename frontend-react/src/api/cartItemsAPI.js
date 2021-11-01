import axios from 'axios';
require('dotenv').config();
const baseURL = process.env.REACT_APP_BASE_URL;
const API = baseURL + '/cartItems/';

class CartItemsAPI{

    static async getCartItems(token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await axios.get(API, {headers: headers});
            return (response?.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    static async clearCartItems(token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            await axios.delete(API, {headers: headers});
        }
        catch(e){
            console.log(e);
        }
    }

    static async deleteCartItem(productId, token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const url = API + productId;

        try {
            await axios.delete(url, {headers: headers});
        }
        catch(e){
            console.log(e);
        }
    }

    static async updateCartItem(cartItem, changeInQuantity, token){
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const url = API + cartItem.productId;

        const body = {
            price: cartItem.price,
            name: cartItem.name,
            productId: cartItem.productId,
            quantity: changeInQuantity,
            image: cartItem.image,
        }

        try{
            await axios.put(url, body, {headers: headers});
        }
        catch(e){
            console.log(e);
        }
    }

}
export default CartItemsAPI;