import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Row, Input, Text, Col, Checkbox } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, IUseFormResult, EListFunction } from '@piximind/custom-hook';
import { RootState } from '../redux/store';

const EditUserForm: React.FC = ({userId}) => {
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const [error, setError] = useState<string | undefined>();
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; isSuperAdmin: boolean; password?: string }>({
        name: '',
        email: '',
        isSuperAdmin: false,
    });

    // Initialize form with validation rules
    const form = useForm({
        isRealTimeValidation: true,
        data: [
            {
                value: '',
                isRealTimeValidation: true,
                rules: [{ priority: 1, function: EListFunction.isNotEmpty, messageError: 'Name is required' }],
                key: 'name',
            },
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: EListFunction.isNotEmpty, messageError: 'Email is required' },
                    { priority: 2, function: EListFunction.isMail, messageError: 'Invalid email' },
                ],
                key: 'email',
            },
            {
                value: false,
                isRealTimeValidation: true,
                rules: [],
                key: 'isSuperAdmin',
            },
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: isChangePassword ? 'isNotEmpty' : 'isEmpty', messageError: 'Password is required if changing' },
                ],
                key: 'password', // optional password field
            },
        ],
    }) as IUseFormResult;

    const { state, onChange, isFormValid ,onUpdateState} = form;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data.data;
                setUser(userData);
                onUpdateState({
                    ...state,
                    name: { value: userData.name, isValid: true },
                    email: { value: userData.email, isValid: true },
                    isSuperAdmin: { value: userData.isSuperAdmin, isValid: true },

                })
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                setError(error.response?.data?.message || 'An error occurred');
            }
        };

        fetchUserData();
    }, [userId, token]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isFormValid) {
            try {
                const name = state.name?.value as string;
                const email = state.email?.value as string;
                const isSuperAdmin = state.isSuperAdmin?.value as boolean;
                const password = state.password?.value as string | undefined;

                const updateUserDto: any = {
                    name,
                    email,
                    isSuperAdmin,
                };

                if (password) {
                    updateUserDto.password = password;
                }

                const response = await axios.put(`http://localhost:3000/user/${userId}`, updateUserDto, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    window.location.reload()
                } else {
                    setError('User update failed. Please try again.');
                }
            } catch (error: any) {
                console.error('Error updating user:', error);
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Please fill out all required fields correctly.');
        }
    };

    return (
        <Col className='ds-borad-20'>
            <Text text="Edit User" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50' />
            <Col className="ds-pb-20">
                <Input
                    label='Name'
                    type="text"
                    inputSize="large"
                    placeholder="Name"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "user", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'name', value: e.target.value })}
                    value={state.name?.value}
                    isInvalid={state.name?.isInvalid}
                    isValid={state.name?.isValid}
                    error={state.name?.errorMessage}
                    errorClassName='ds-text-error800'
                />
            </Col>
            <Col className="ds-pb-20">
                <Input
                    label='Email'
                    type="text"
                    inputSize="large"
                    placeholder="Email"
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
            <Col className="ds-pb-20">
                <Checkbox
                    label="Super Admin"
                    checked={state.isSuperAdmin?.value as boolean }
                    onClick={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'isSuperAdmin', value: e.target.checked })}
                />
            </Col>
            <Col className="ds-pb-20">
                <Checkbox
                    label='Change Password?'
                    checked={isChangePassword}
                    onClick={() => setIsChangePassword(!isChangePassword)}
                />
                {isChangePassword &&
                    <Input
                        label='Password'
                        type="password"
                        inputSize="large"
                        placeholder="Password (optional)"
                        className="ds-box-shadow3 ds-bg-neutral100"
                        listIcons={[{ icon: "key", isLeft: true, color: "#79c300", size: 25 }]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'password', value: e.target.value })}
                        value={state.password?.value || ''}
                        isInvalid={state.password?.isInvalid}
                        isValid={state.password?.isValid}
                        error={state.password?.errorMessage}
                        errorClassName='ds-text-error800'
                    />
                }
            </Col>
            {error && <Text className='ds-text-error600' text={error} />}
            <Col className="ds-pt-10">
                <Row className="ds-p-15">
                    <Button
                        text="Update User"
                        className='ds-mr-10'
                        onClick={handleSubmit}
                    />
                </Row>
            </Col>
        </Col>
    );
}

export default EditUserForm;
