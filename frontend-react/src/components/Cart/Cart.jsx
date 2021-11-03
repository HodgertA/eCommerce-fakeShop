import React, {useContext} from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem'
import CartItemsAPI from "../../api/cartItemsAPI"
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

import useStyles from './styles';
import isLoggedIn from '../../shared/generalUtils';

const Cart = () => {
    const classes = useStyles();

    const { accessToken } = useContext(AuthContext);
    const { cartItems, setCartItems } = useContext(CartContext);

    const isEmpty = cartItems ? !cartItems.length : true;

    const handleUpdateCartQty = async (productId, quantityChange) => {
        const updateIndex = cartItems.findIndex(item => item.productId === productId);
        const newQuantity = cartItems[updateIndex].quantity + quantityChange;
        
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
            if(isLoggedIn(accessToken)) {
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
        if(isLoggedIn(accessToken)) {
            await CartItemsAPI.deleteCartItem(productId, accessToken);
        }
    }

    const handleEmptyCart = async () => {
        setCartItems([]);
        if(isLoggedIn(accessToken)) {
            await CartItemsAPI.clearCartItems(accessToken)
        }
    }

    const calculateSubtotal = () => {
        var subtotal = 0;

        for (const cartItem of cartItems){
            subtotal += cartItem.price * cartItem.quantity;
        }
        return subtotal;
    }

    const EmptyCart = () => (
        <Typography variant="subtitle1"> You have no items in your shopping cart, {<Link to="/">start by adding some! </Link>}
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cartItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.productId}>
                        <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: ${calculateSubtotal().toFixed(2)}
                </Typography>
                <div className={classes.buttons}>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to ="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color = "primary">Checkout</Button>

                </div>
            </div>
        </>
    )

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom> Your Shopping Cart</Typography>
            { isEmpty ? <EmptyCart /> : <FilledCart/>  }
        </Container>
    )
}

export default Cart;
