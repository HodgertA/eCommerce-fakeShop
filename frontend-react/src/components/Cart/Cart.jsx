import React from 'react';
import useStyles from './styles';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CartItem from './CartItem/CartItem'

const Cart = ({ cartItems, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();
    const isEmpty = cartItems ? !cartItems.length : true;

    const EmptyCart = () => (
        <Typography variant="subtitle1"> You have no items in your shopping cart, {<Link to="/">start by adding some! </Link>}
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cartItems.map((item) => (
                    <Grid item xs={12} sm={4} key={item.productId}>
                        <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: ${calculateSubtotal()}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button className={classes.checkoutButton} size="large" type="button" variant="contained" color = "primary">Checkout</Button>

                </div>
            </div>
        </>
    )

    const calculateSubtotal = () => {
        var subtotal = 0;

        for (const cartItem of cartItems){
            subtotal += cartItem.price * cartItem.quantity;
        }
        return subtotal;
    }

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom> Your Shopping Cart</Typography>
            { isEmpty ? <EmptyCart /> : <FilledCart/>  }
        </Container>
    )
}

export default Cart;
