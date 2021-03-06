import React, { useRef, useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

import LoginAPI from "../../api/loginAPI";

const Login = () => {
    const { setAccessToken } = useContext(AuthContext);

    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError] =  useState('');
    const [loading, setLoading] =  useState(false);

    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            setError('');
            setLoading(true);
            const response = await LoginAPI.loginUser(emailRef.current.value, passwordRef.current.value);

            if(response?.loginFailed) {
                setError(response.loginFailed)
                setLoading(false);
            }
            else if(response?.accessToken) {
                setAccessToken(response.accessToken);
                setLoading(false);
                history.push('/');
            }
        }
        catch(e) {
            setError("Failed to login.")
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
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
                    <Button disabled={loading} className="w-100" type="submit">
                        Log In
                    </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/register">Sign Up</Link>
            </div>
        </>
    )
}

export default Login;
