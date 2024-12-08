import { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import { Button, Row, Input, Text, Col } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useForm } from '@piximind/custom-hook';

function Resetpassword() {
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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
                const email = state.email?.value as string;
                const response = await axios.post('http://localhost:3000/user/request-password-reset', { email });
                if (response.data.statusCode === 200) {
                    setMessage(response.data.message);
                } else {
                    setError(response.data.message);
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Please type a valid Email.');
        }
    };

    return (
        <Col className=''>
            <Text
                text="Reset Password"
                type="type-4"
                className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-60'
            />
            <Col className="ds-pb-10">
                <Input
                    type="text"
                    inputSize='large'
                    placeholder="email"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "mail", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'email', value: e.target.value })}
                    value={state.email?.value as string}
                    isInvalid={state.email?.isInvalid}
                    isValid={state.email?.isValid}
                    error={state.email?.errorMessage}
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
                        text="Reset password"
                        className='ds-mr-10'
                        onClick={handlePasswordReset}
                    />
                </Row>
            </Col>
        </Col>
    );
}

export default Resetpassword;
