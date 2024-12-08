import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import { Button, Row, Input, Text, Col } from '@piximind/ds-p-23';
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
    }) as IUseFormResult;

    const { state, onChange, onValidForm, isFormValid, onReset } = form;

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
            setError('Form is invalid');
        }
    };

    return (
        <Col className='ds-w-20 ds-bg-neutral200 ds-borad-20 ds-mt-200 ds-ml-200'>
            <Text
                text="Set a new password"
                type="type-4"
                className='ds-text-primary ds-pt-50 ds-pl-80'
            />
            <Col className="ds-pb-10">
                <Input
                    type="password"
                    inputSize="large"
                    placeholder="New password"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "key", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ key: 'password', value: e.target.value })}
                    value={state.password?.value as string}
                    isInvalid={state.password?.isInvalid}
                    isValid={state.password?.isValid}
                    error={state.password?.errorMessage}
                    errorClassName='ds-text-error800'
                />
            </Col>
            <Col>
                {error && <Text className='ds-text-error600' text={error} />}
                {message && <Text className='ds-text-success800' text={message} />}
            </Col>
            <Col>
                <Row className="ds-p-15">
                    <Button
                        text="Confirm new password"
                        className='ds-mr-10'
                        onClick={handlePasswordReset}
                    />
                </Row>
            </Col>
        </Col>
    );
}

export default Confirmresetpassword;
