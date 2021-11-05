import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingBasketOutlined } from '@material-ui/icons';
import{ Link, useLocation } from 'react-router-dom';
import logo from '../../assests/logo.png';

import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

import useStyles from './styles';
import isLoggedIn from "../../shared/generalUtils";

const Navbar = () => {
    const classes = useStyles();
    const location = useLocation();
    const { accessToken } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

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

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="secondary">
                        <img src={logo} alt="Commerce.js" height="25px" className={classes.image} />
                        Aidan's Magic Goods
                    </Typography>
                    <div className={classes.grom} />
                    {isLoggedIn(accessToken) ? (
                            <Typography className="mr-2">
                                <Link to="/myAccount" color="secondary">
                                    My Account
                                </Link>
                            </Typography>
                        ) : location.pathname !== '/register' &&  location.pathname !== '/login' && location.pathname !== '/checkout' && location.pathname !== '/myAccount' ?(
                            <Typography className="mr-2" color="secondary">
                                <Link to="/register">
                                    Sign Up
                                </Link>
                            </Typography>
                        ): (
                            <>
                            </>
                        )}
                    {location.pathname === '/' && (
                        <div className={classes.button}>
                            <IconButton component={Link} to="/cartItems" color="secondary" aria-label="Show cart items" >
                                <Badge badgeContent={numItemsInCart()}>
                                    <ShoppingBasketOutlined />
                                </Badge>
                            </IconButton>
                        </div>
                    )}
                </Toolbar>

            </AppBar>
        </>
    )
}
export default Navbar;