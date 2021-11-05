import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Products, Cart, SignUp, Login, Checkout, AccountDashboard } from './components';
import { CartContext } from './contexts/CartContext';
import { AuthContext } from './contexts/AuthContext';

import CartItemsAPI from "./api/cartItemsAPI"
import isLoggedIn from './shared/generalUtils';

import { ThemeProvider, createTheme } from '@material-ui/core/styles';
const theme = createTheme({
    typography: {
        fontFamily: ['MedievalSharp', 'cursive']
    },
    palette: {
        primary: {
            main: "#191919"
        },
        secondary: {
            main: "#FDF5A6"
        },
        red: {
            main: "#FDF5A6"
        }
    }   
});

const App = () => {


    const [cartItems, setCartItems] = useState(null);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        getLocalCartItems();
        getLocalAccessToken();
    }, []);

    const getLocalCartItems = async () => {
        const savedCartItems = JSON.parse(window.localStorage.getItem('cartItems'));
            
        if(savedCartItems) {
            setCartItems(savedCartItems);
        }
        else{
            setCartItems([]);
        }
    }

    useEffect(() => {
        if(cartItems){
            window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const getLocalAccessToken = () => {
        const savedAccessToken = window.localStorage.getItem('accessToken');
        setAccessToken(savedAccessToken);
    }

    useEffect(() => {
        const updateCartItems = async () => {
            if(isLoggedIn(accessToken)) {
                
                try { 
                    const cart = await CartItemsAPI.getCartItems(accessToken);
                    setCartItems(cart);
                }
                catch(e){
                    console.log(e);
                }
                
            }
        }
        window.localStorage.setItem("accessToken", accessToken);
        updateCartItems();
    }, [accessToken]);
    
    return (
        <ThemeProvider theme={theme}>
            <CartContext.Provider value={{ cartItems, setCartItems }}>
                <AuthContext.Provider value={{ accessToken, setAccessToken }}>
                    <Router>
                        <div>
                            <Navbar />

                            <Switch>

                                <Route exact path="/">
                                    <Products />
                                </Route>

                                <Route exact path="/cartItems">
                                    <Cart />
                                </Route> 

                                <Route exact path="/register">
                                    <Container className="d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
                                        <div className="w-100" style={{maxWidth: "400px"}}>
                                            <SignUp />
                                        </div>
                                    </Container>
                                </Route>

                                <Route exact path="/login">
                                    <Container className="d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
                                        <div className="w-100" style={{maxWidth: "400px"}}>
                                            <Login />
                                        </div>
                                    </Container>
                                </Route>

                                <Route exact path="/checkout">
                                    <Checkout />
                                </Route>

                                <Route exact path="/myAccount">
                                    <AccountDashboard />
                                </Route>
                                
                            </Switch>
                        </div>
                    </Router>
                </AuthContext.Provider>
            </CartContext.Provider>
        </ThemeProvider>
    )
}

export default App;