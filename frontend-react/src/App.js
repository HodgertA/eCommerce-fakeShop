import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Navbar, Products, Cart, SignUp } from './components';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'

const API = "https://i5d2y0hat5.execute-api.ca-central-1.amazonaws.com/dev/"

const App = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        getCartItems();
        getProducts();
    }, []);

    useEffect(() => {
        if(cartItems){
            window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const getProducts = async () => {
        const url = API + 'products'
        try{
            const response = await axios.get(url);
            setProducts(response?.data);
            // addItemToCart(products[0]);
            // addItemToCart(products[1]);
        }
        catch(e){
            console.log(e);
        }
    }

    const getCartItems = async () => {
        //if logged in
            //get cartItems and setCartItems

        //else get Items from local session
            const savedCartItems = JSON.parse(window.localStorage.getItem('cartItems'));
            if(savedCartItems){
                setCartItems(savedCartItems);
            }
    }

    const handleAddToCart = async (cartItem) => {
        setCartItems(prevCartItems => {
            const isItemInCart = prevCartItems.find(item => item.productId === cartItem.productId);
      
            if (isItemInCart) {
              return prevCartItems.map(item =>
                item.productId === cartItem.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
            }
            // First time the item is added
            return [...prevCartItems, { ...cartItem, quantity: 1 }];
        });
    }

    const handleUpdateCartQty = async (productId, quantity) => {

        if(quantity < 1 ){
            handleRemoveFromCart(productId);
        }
        else{
            setCartItems(prevCartItems => {
                return prevCartItems.map(item => 
                    item.productId === productId
                    ? { ...item, quantity: quantity}
                    : item
                );
            });
        }

    }

    const handleRemoveFromCart = async (productId) => {
        var cartItemsCopy = [...cartItems];
        const removeIndex = cartItemsCopy.findIndex(item => item.productId == productId);
        
        
        if (removeIndex > -1) {
            cartItemsCopy.splice(removeIndex, 1);
          }

        setCartItems(cartItemsCopy);
    }

    const handleEmptyCart = async () => {
        setCartItems([]);
    }



    const numItemsInCart = () => {
        var numItemsInCart = 0;

        for (const cartItem of cartItems){
            numItemsInCart += cartItem.quantity;
        }
        return numItemsInCart;
    }

    return (
        <Router>
            <div>
                <Navbar totalItems={numItemsInCart()}/>
                <Switch>
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route exact path="/cartItems">
                        <Cart cartItems={cartItems}
                        handleRemoveFromCart={handleRemoveFromCart}
                        handleEmptyCart={handleEmptyCart}
                        handleUpdateCartQty={handleUpdateCartQty}
                        />
                    </Route>
                </Switch>

                
            </div>
        </Router>
    )
}

export default App;