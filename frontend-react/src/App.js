import React, {useState, useEffect} from 'react';
import {Navbar, Products, Cart, SignUp, Login } from './components';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {Container} from 'react-bootstrap';

import jwt from 'jsonwebtoken';

import ProductsAPI from "./api/ProductsAPI";

import 'bootstrap/dist/css/bootstrap.min.css'

const API = "https://i5d2y0hat5.execute-api.ca-central-1.amazonaws.com/dev/"

const App = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        getCartItems();
        getProducts();
        getAccessToken();
    }, []);

    useEffect(() => {
        if(cartItems){
            window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    useEffect(() => {
        window.localStorage.setItem("accessToken", accessToken);
    }, [accessToken]);

    const getAccessToken = () => {
        const accessToken = window.localStorage.getItem('accessToken');
        if(accessToken){
            setAccessToken(accessToken)
        }
    }

    const getProducts = async () => {
        const products = await ProductsAPI.getProducts();
        if(products){
            setProducts(products);
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

    const setLoggedInUser = async (accessToken) => {
        if(accessToken){
            setAccessToken(accessToken.accessToken);
        }
    }

    const logoutUser = () => {
        setAccessToken("");
    }

    const isLoggedIn = () => {
        var isLoggedIn = false;

        if(accessToken){
            const response = jwt.verify(accessToken, process.env.REACT_APP_ACCESS_TOKEN_SECRET);
            console.log(response);
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    return (
        <Router>
            <div>
                <Navbar totalItems={numItemsInCart()} isLoggedIn={isLoggedIn()}/>
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
                    <Route exact path="/register">
                        <Container className="d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
                            <div className="w-100" style={{maxWidth: "400px"}}>
                                <SignUp setLoggedInUser={setLoggedInUser}/>
                            </div>
                        </Container>
                    </Route>
                    <Route exact path="/login">
                        <Container className="d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
                            <div className="w-100" style={{maxWidth: "400px"}}>
                                <Login setLoggedInUser={setLoggedInUser}/>
                            </div>
                        </Container>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;