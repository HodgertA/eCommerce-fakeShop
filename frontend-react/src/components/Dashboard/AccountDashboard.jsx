import React, { useState, useContext, useEffect } from 'react'
import {Paper, Stepper, Step, Typography, Button, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from './styles';
import Orders from './Orders';
import OrderItems from './OrderItems';
import { AuthContext } from '../../contexts/AuthContext';
import OrdersAPI from '../../api/ordersAPI';
import isLoggedIn from '../../shared/generalUtils';

const steps = ["Orders", "OrderItems"]

const AccountDashboard = () => {
    const classes = useStyles();

    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [activeStep, setActiveStep] = useState(0);
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState(null);
    const [isItemsLoading, setIsItemsLoading] = useState(false);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);

    useEffect(() => {
        const getOrders = async () => {
            if( isLoggedIn(accessToken) ) {
                const response = await OrdersAPI.getOrders(accessToken);
                setOrders(sortOrders(response));
            }
            setIsOrdersLoading(false);
        }
        const sortOrders = (orderData) => {
            orderData.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0))
            return orderData;
        }

        getOrders();
    }, [accessToken])

    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const setItemsLoading = (bool) => setIsItemsLoading(bool);
    const setOrder = (orderItems) => setOrderItems(orderItems);
    const logout = () => setAccessToken("");

    const PastOrders = () => !isOrdersLoading ? (
        <div>
            <Orders orders={orders} nextStep={nextStep} isLoading={setItemsLoading} setOrderItems={setOrder}/>
        </div>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    const OrderDetails = () => !isItemsLoading ? (
        <div>
            <OrderItems orderItems={orderItems} backStep={backStep}/>
        </div>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    const PastPurchases = () => activeStep === 0
    ? <PastOrders />
    : <OrderDetails />
    
    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">My Orders</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                            </Step>
                        ))}
                    </Stepper>
                    {<PastPurchases />}
                    <Button className={classes.logoutButton} onClick={logout} component={Link} to ="/"   type="button" variant="contained" color = "secondary">Logout</Button>
                </Paper>

            </main>
        </>
    )
}
export default AccountDashboard;
