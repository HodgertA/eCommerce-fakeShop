import React, { useContext } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton} from "@material-ui/core";
import { Link } from "react-router-dom";
import OrdersAPI from '../../api/ordersAPI';
import { NavigateNext } from '@material-ui/icons';
import { AuthContext } from '../../contexts/AuthContext';

const Orders = ( {orders, nextStep, isLoading, setOrderItems} ) => {

    const { accessToken } = useContext(AuthContext);

    const formattedDate = (epochTime) => {
        const date = new Date(epochTime * 1000);
        return (new Intl.DateTimeFormat('en-US').format(date));
    }

    const viewOrderDetails = async (orderId) => {
        isLoading(true);
        nextStep();

        const orderDetails = await OrdersAPI.getOrderDetails(orderId, accessToken);
        setOrderItems(orderDetails);
        
        isLoading(false);
    }

    const row = (order) => (
            <TableRow
            key={order.orderId}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left" width="5px">
                    <IconButton aria-label="Expand" onClick={() => viewOrderDetails(order.orderId)}>
                        <NavigateNext />
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {formattedDate(order.createdAt)}
                </TableCell>
                <TableCell align="right">{order.status}</TableCell>
                <TableCell align="right">${(order.amount/100).toFixed(2)}</TableCell>
            </TableRow>
    );

    return (
        (orders && orders.length) ? (
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow key="header">
                    <TableCell align="left"></TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="right">Order Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map( (order) => row(order))}
                </TableBody>
            </Table>
            </TableContainer>
        ) : (
            <Typography variant="subtitle1" align="center"> You have no past purchases, {<Link to="/">start shopping! </Link>}
            </Typography>
        )
            
    );
}

export default Orders;
