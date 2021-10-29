import React from 'react'
import {Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom'

import FormInput from './FormInput'

const AddressForm = ({ next }) => {
    const methods = useForm();

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next(data))}>
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First name'/>
                        <FormInput name='lastName' label='Last name'/>
                        <FormInput name='email' label='Email'/>
                        <FormInput name='address1' label='Address'/>
                        <FormInput name='city' label='City'/>
                        <FormInput name='zip' label='Postal code / ZIP'/>
                        <FormInput name='province' label='Province / State'/>
                        <FormInput name='country' label='Country'/>
                    </Grid>
                    <br />
                    <div style ={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cartItems" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}

export default AddressForm
