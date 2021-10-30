import React, { useState } from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, Divider, Button, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom"
import useStyles from './styles';
import AddressForm from './Shipping/AddressForm';
import PaymentForm from './Payment/PaymentForm';

const steps = ['Shipping address', 'Payment details']

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const classes = useStyles();
    const [shippingData, setShippingData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    const paymentIsLoading = (bool) => setLoading(bool);
    const setPaymentError = (newError) => setError(newError);

    let Confirmation = () => !loading ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">An order confirmation has been sent to your email.</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        Confirmation = () => (
            <>
                <div>
                    <Typography variant="h5">We were unable to process your order</Typography>
                    <Divider className={classes.divider} />
                    <Typography variant="subtitle2">{error}</Typography>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </>
        )
    }

    const Form = () => activeStep === 0
        ? <AddressForm next={next} />
        : <PaymentForm shippingData={shippingData} backStep={backStep} nextStep={nextStep} paymentIsLoading={paymentIsLoading} setPaymentError={setPaymentError}/>

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
