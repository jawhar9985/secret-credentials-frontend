import React, { useState, MouseEvent } from 'react';
import axios from 'axios';
import { Button, Input, Text, Col } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '@piximind/custom-hook';

function Confirmresetpassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const form = useForm({
        isRealTimeValidation: true,
        data: [
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: 'isNotEmpty', messageError: 'Password is required' },
                ],
                key: 'password'
            }
        ]
    });

    const { state, onChange, isFormValid } = form;

    const handlePasswordReset = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (isFormValid) {
            try {
                const password = state.password?.value as string;
                const response = await axios.post(`http://localhost:3000/user/reset-password?token=${token}`, { password });
                if (response.data.statusCode === 200) {
                    setMessage(response.data.message);
                    setTimeout(() => navigate('/'), 3000);
                } else {
                    setError(response.data.message);
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Please enter a valid password.');
        }
    };

    return (
        <div className='ds-w-100 ds-h-100 ds-flex-col ds-center'>
            <Text text="Set a New Password" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary' />
            <div style={{ width: '400px' }} className='ds-box-shadow1 ds-bg-white ds-p-12 ds-borad-20'>
                <Input
                    type="password"
                    inputSize="large"
                    placeholder="New password"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "key", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e) => onChange({ key: 'password', value: e.target.value })}
                    value={state.password?.value as string}
                    isInvalid={state.password?.isInvalid}
                    isValid={state.password?.isValid}
                    error={state.password?.errorMessage}
                    errorClassName='ds-text-error800'
                    containerClassName='ds-my-20'
                />
                {error && <Text className='ds-text-error600' text={error} />}
                {message && <Text className='ds-text-success800' text={message} />}
                <Button
                    text="Confirm New Password"
                    className='ds-my-8 ds-w-100'
                    onClick={handlePasswordReset}
                />
            </div>
        </div>
    );
}

export default Confirmresetpassword;
