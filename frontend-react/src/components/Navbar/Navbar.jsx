import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingBasketOutlined } from '@material-ui/icons';
import{ Link, useLocation } from 'react-router-dom';


import logo from '../../assests/logo.png';
import useStyles from './styles';

const Navbar = ({ totalItems, isLoggedIn }) => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="Commerce.js" height="25px" className={classes.image} />
                        Aidan's Faux-Shop
                    </Typography>
                    <div className={classes.grom} />
                    {isLoggedIn ? (
                            <Typography className="mr-2">
                                <Link to="/myAccount">
                                    My Account
                                </Link>
                            </Typography>
                        ) : location.pathname !== '/register' &&  location.pathname !== '/login' ?(
                            <Typography className="mr-2">
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
                            <IconButton component={Link} to="/cartItems" aria-label="Show cart items" color="inherit">
                                <Badge badgeContent={totalItems} color="secondary">
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