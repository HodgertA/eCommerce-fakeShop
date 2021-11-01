import React, { useRef, useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'; 

import UsersAPI from "../../api/usersAPI";
import { AuthContext } from '../../contexts/AuthContext';

const SignUp = () => {
    const { setAccessToken } = useContext(AuthContext);

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const [error, setError] =  useState('');
    const [loading, setLoading] =  useState(false);

    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match")
        }
        
        try {
            setError('');
            setLoading(true);
            const response = await UsersAPI.regitserUser(emailRef.current.value, passwordRef.current.value)
            console.log(response);
            if(response.emailExists){
                setError("An account with this email already exists")
            }
            else if(response?.accessToken) {
                setAccessToken(response.accessToken);
                history.push('/');
            }
        }
        catch(e) {
            setError("Failed to create an account.")
        }
        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                    <Form.Group id="passsword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                    <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">
                        Sign Up
                    </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    )
}

export default SignUp;
