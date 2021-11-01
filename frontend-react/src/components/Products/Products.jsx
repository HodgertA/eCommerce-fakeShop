import React, { useEffect, useContext, useState }  from "react";
import { Grid } from "@material-ui/core";
import Product from './Product/Product'

import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

import useStyles from './styles';
import isLoggedIn from "../../shared/generalUtils";
import CartItemsAPI from "../../api/cartItemsAPI";
import ProductsAPI from "../../api/productsAPI";

const Products = () => {
    const classes = useStyles();

    const [products, setProducts] = useState([]);

    const { accessToken } = useContext(AuthContext);
    const { setCartItems } = useContext(CartContext);

    useEffect(() => {
        const getProductsForSale = async () => {
            
            const productsForSale = await ProductsAPI.getProducts();
            if(productsForSale){
                setProducts(productsForSale);
            }
        }
        getProductsForSale();
    }, [])

    const onAddToCart = async (cartItem) => {
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

        if(isLoggedIn(accessToken)) {
            await CartItemsAPI.updateCartItem(cartItem, 1, accessToken);
        }
    }

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justifyContent="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} onAddToCart={onAddToCart}/>
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products;