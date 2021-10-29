import React, {useState, useEffect} from 'react';
import {Navbar, Products, Cart, SignUp, Login, Checkout } from './components';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {Container} from 'react-bootstrap';

import ProductsAPI from "./api/ProductsAPI";
import CartItemsAPI from "./api/CartItemsAPI"

import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(null);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        getLocalCartItems();
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

        const updateCartItems = async () => {
            if(accessToken && accessToken!=="null") {
                const cart = await CartItemsAPI.getCartItems(accessToken);
                setCartItems(cart);
            }
        }

        updateCartItems();
    }, [accessToken]);

    const getAccessToken = () => {
        const newAccessToken = window.localStorage.getItem('accessToken');
        setAccessToken(newAccessToken);
    }

    const getProducts = async () => {
        const productsForSale = await ProductsAPI.getProducts();
        if(productsForSale){
            setProducts(productsForSale);
        }
    }

    const getLocalCartItems = async () => {
        const savedCartItems = JSON.parse(window.localStorage.getItem('cartItems'));
            
        if(savedCartItems) {
            setCartItems(savedCartItems);
        }
        else{
            setCartItems([]);
        }
    }

    const handleCaptureCheckout = async (paymentIntent) => {
        //create order
        await handleEmptyCart()

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

        if(isLoggedIn()) {
            await CartItemsAPI.updateCartItem(cartItem, 1, accessToken);
        }
    }

    const handleUpdateCartQty = async (productId, quantityChange) => {
        
        const updateIndex = cartItems.findIndex(item => item.productId === productId);
        const newQuantity = cartItems[updateIndex].quantity + quantityChange;
        
        console.log(newQuantity);
        if(newQuantity < 1) {
            handleRemoveFromCart(productId);
        }

        else {
            setCartItems(prevCartItems => {
                return prevCartItems.map(item => 
                    item.productId === productId
                    ? { ...item, quantity: newQuantity}
                    : item
                );
            });
            if(isLoggedIn()) {
                await CartItemsAPI.updateCartItem(cartItems[updateIndex], quantityChange, accessToken);
            }
        }
    }

    const handleRemoveFromCart = async (productId) => {
        var cartItemsCopy = [...cartItems];
        const removeIndex = cartItemsCopy.findIndex(item => item.productId === productId);
        
        if (removeIndex > -1) {
            cartItemsCopy.splice(removeIndex, 1);
          }

        setCartItems(cartItemsCopy);
        if(isLoggedIn()) {
            await CartItemsAPI.deleteCartItem(productId, accessToken);
        }
    }

    const handleEmptyCart = async () => {
        setCartItems([]);
        if(isLoggedIn()) {
            await CartItemsAPI.clearCartItems(accessToken)
        }
    }

    const numItemsInCart = () => {
        if (!cartItems){
            return 0;
        }

        var numItemsInCart = 0;

        for (const cartItem of cartItems) {
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
        if(accessToken && accessToken!=="null") {
            return true;
        }
        else {
            return false;
        }
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
                    <Route exact path="/checkout">
                        <Checkout cartItems={cartItems} onCaptureCheckout={handleCaptureCheckout}
                     />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;