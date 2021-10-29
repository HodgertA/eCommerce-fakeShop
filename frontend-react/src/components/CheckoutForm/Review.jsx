import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

const Review = ({cartItems, calculateSubtotal}) => {
    return (
        <>
            <Typography variant="h6" gutterBottom>Order summary</Typography>
            <List disablePadding>
                {cartItems.map((cartItem) => (
                    <ListItem style={{padding: '10px 0'}} key={cartItem.productId}>
                        <ListItemText primary={cartItem.name} secondary={`Quantity: ${cartItem.quantity}`} />
                        <Typography variant="body2">${(cartItem.price*cartItem.quantity).toFixed(2)}</Typography>
                    </ListItem>
                ))}
                <ListItem style={{padding: '10px 0'}}>
                    <ListItemText primary="Total" />
                        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                            ${calculateSubtotal().toFixed(2)}
                        </Typography>
                </ListItem>
            </List>
        </>
    )
}

export default Review
