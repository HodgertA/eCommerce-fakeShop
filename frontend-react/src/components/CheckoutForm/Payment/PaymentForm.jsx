import React, {useContext} from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import OrderReview from './OrderReview';

import { CartContext } from '../../../contexts/CartContext';
import { AuthContext } from '../../../contexts/AuthContext';

import isLoggedIn from "../../../shared/generalUtils";
import OrdersAPI from "../../../api/OrdersAPI";
import CartItemsAPI from "../../../api/CartItemsAPI";

const stripePromise = loadStripe('pk_test_51JpQj5FWucyQVser8v1mSuaSZNhk6OGo2VY6KDmigx6NwoOJCrqd3S8Aln0jrc6lXT7S8iWu1drwbJ5A2hrYR75U00Byajeu3x');

const PaymentForm = ({shippingData, backStep, nextStep, paymentIsLoading, setPaymentError }) => {
    const { accessToken } = useContext(AuthContext);
    const { cartItems, setCartItems } = useContext(CartContext);

    const handleSubmit = async (event, elements, stripe) =>{
        event.preventDefault();

        if(!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        try {
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            });

            nextStep();
            paymentIsLoading(true);
            
            if(error){
                setPaymentError(error.message);
            }
            else{
                await handleCaptureCheckout(paymentMethod.id, shippingData, calculateTotal())
            }
        }
        catch(e){
            setPaymentError(e.message);
        }

        paymentIsLoading(false);
    }

    const handleCaptureCheckout = async (paymentMethodId, shippingData, amount) => {
        let token;
        if(isLoggedIn(accessToken)){
            token = accessToken;
        }

        const { error } = await OrdersAPI.processCheckout(paymentMethodId, cartItems, shippingData, amount, token);
        
        if(error) {
            throw(new Error(error));
        }
        else{
            clearCart()
        }
    }

    const clearCart = async () => {
        setCartItems([]);
    
        if(isLoggedIn(accessToken)){
            await CartItemsAPI.clearCartItems(accessToken);
        }
    }

    const calculateTotal = () => {
        var subtotal = 0;

        for (const cartItem of cartItems){
            subtotal += cartItem.price * cartItem.quantity;
        }
        return subtotal;
    }

    return (
        <>
            <OrderReview cartItems={cartItems} calculateTotal={calculateTotal} />
            <Divider />
            <Typography variant="h6" gutterBottom style={{margin:'20px 0'}}>Payment method</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement  options={{ hidePostalCode: true }}/>
                            <br /> <br />
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button variant="outlined" onClick={backStep}>Back</Button>
                                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                                    Pay ${calculateTotal().toFixed(2)}
                                </Button>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </>

    )
}

export default PaymentForm
