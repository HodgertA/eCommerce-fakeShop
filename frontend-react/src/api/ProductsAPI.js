import axios from 'axios';
require('dotenv').config();

const baseURL = process.env.REACT_APP_BASE_URL;
const API = baseURL + '/products';

class ProductsAPI{
    static async getProducts(){
        try{
            const response = await axios.get(API);
            return (response?.data);
        }
        catch(e){
            console.log(e);
        }
    }
}
export default ProductsAPI;