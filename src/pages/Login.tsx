import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Input, Text, Col, TypeButton } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useNavigate } from 'react-router-dom';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { setCredentials, setUser } from '../redux/slices/authSlice'; // Ensure setCredentials is imported
import { RootState } from '../redux/store';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | undefined>();
    const user = useSelector((state: RootState) => state.auth.user);

    // Initialize form with validation rules
    const form = useForm({
        isRealTimeValidation: true,
        data: [
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: 'isNotEmpty', messageError: 'Email is required' },
                    { priority: 2, function: 'isMail', messageError: 'Invalid email' }
                ],
                key: 'email'
            },
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: 'isNotEmpty', messageError: 'Password is required' },
                ],
                key: 'password'
            }
        ]
    }) as IUseFormResult;

    const { state, onChange, isFormValid } = form;

    // Handle password reset navigation
    const handleNavigate = () => {
        navigate('/reset-password');
    };

    // Handle login
    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Form state on login:', state);

        if (isFormValid) {
            try {
                const email = state.email?.value as string;
                const password = state.password?.value as string;

                if (!email || !password) {
                    setError('Email or password is missing.');
                    return;
                }

                const response = await axios.post('http://localhost:3000/user/login', { email, password });

                console.log('Response from server:', response.data);

                const { token, user, message, statusCode } = response.data;
                if (statusCode === 200 && token) {
                    dispatch(setCredentials({ accessToken: token, refreshToken: token })); // Adjust if necessary
                    dispatch(setUser(user));

                    navigate('/my-projects');
                } else if (statusCode === 401) {
                    setError(message || 'Unauthorized access.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } catch (error: any) {
                console.error('Error during login:', error);
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Invalid Email or/and Password.');
        }
    };


    useEffect(() => {
        if (user) {
            navigate('/my-projects');
        }
    }, [user, navigate]);

    return (
        <div className='ds-w-100 ds-h-100 ds-flex-col ds-center'>
            <Text text="Login" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary' />
            <div style={{ width: '400px' }} className='ds-box-shadow1 ds-bg-white ds-p-12 ds-borad-20'>
                <Input
                    type="text"
                    inputSize="large"
                    placeholder="email"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "mail", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'email', value: e.target.value })}
                    value={state.email?.value as string}
                    isInvalid={state.email?.isInvalid}
                    isValid={state.email?.isValid}
                    error={state.email?.errorMessage}
                    errorClassName='ds-text-error800'
                    containerClassName='ds-my-20'
                />


                <Input
                    type="password"
                    inputSize="large"
                    placeholder="password"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "key", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'password', value: e.target.value })}
                    value={state.password?.value as string}
                    isValid={state.password?.isValid}
                    isInvalid={state.password?.isInvalid}
                    error={state.password?.errorMessage}
                    errorClassName='ds-text-error800'
                />
                {error && <Text className='ds-text-error600' text={error} />}

                <Button
                    text="Login"
                    className='ds-my-8 ds-w-100'
                    onClick={handleLogin}
                />
                <Button
                    text="Reset Password"
                    className='ds-my-8 ds-w-100'
                    onClick={handleNavigate}
                    type={TypeButton.secondary}
                />
            </div>
        </div>

    );
}

export default Login;
