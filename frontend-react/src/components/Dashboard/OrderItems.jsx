import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from "@material-ui/core";
import { NavigateBefore } from '@material-ui/icons';


const OrderDetails = ({orderItems, backStep}) => {
    
    const row = (item) => (
        <TableRow
        key={item.productId}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell></TableCell>
            <TableCell align="left">{item.name}</TableCell>
            <TableCell align="right">{item.quantity}</TableCell>
        </TableRow>
    );

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow key="header">
                    <TableCell align="left" width="5px">
                        <IconButton aria-label="back" onClick={backStep}>
                            <NavigateBefore />
                        </IconButton>
                    </TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {orderItems.map( (item) => row(item))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OrderDetails
