import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Input, Text, Col, Icon, Row } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { RootState } from '../redux/store';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface ListEnvUsersProps {
    envUsers: User[];
    envId: string; // Include envId as prop for identifying the environment
}

const ListEnvUsers: React.FC<ListEnvUsersProps> = ({ envUsers, envId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const form = useForm({
        isRealTimeValidation: true,
        data: [
            { value: '', isRealTimeValidation: true, rules: [], key: 'user' },
        ],
    }) as IUseFormResult;

    const { state, onChange, isFormValid } = form;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedUsers = response.data.data;
                setUsers(fetchedUsers);
                setIsLoading(false);
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred');
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleAddUser = async () => {
        if (isFormValid && envId) {
            try {
                const addUserDto = {
                    email: state.user?.value[0],
                };

                const response = await axios.put(`http://localhost:3000/project/addenvuser/${envId}`, addUserDto, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    window.location.reload();
                } else {
                    setError('Failed to add user.');
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Please select a user.');
        }
    };

    const removeEnvUser = async (userId: string) => {
        try {
            const response = await axios.put(`http://localhost:3000/project/removeenvuser/${envId}/${userId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                setError('Failed to remove user.');
            }
        } catch (error: any) {
            console.log(error)
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Col className="ds-border-20">
            <Text text="Add User to Environment" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
            {isLoading ? (
                <Text text="Loading..." />
            ) : (
                <>
                    <ul>
                        {envUsers.map(user => (
                            <Row key={user._id} className="ds-flex ds-align-center ds-mb-10">
                                
                                <li>{`${user.name} - (${user.email})`}</li>
                                <Icon
                                    icon='x-circle'
                                    size='25'
                                    className="ds-text-error600 ds-ml-10"
                                    onClick={() => removeEnvUser(user._id)}
                                />
                            </Row>
                        ))}
                    </ul>
                    <Input
                        label="Select User"
                        type="text"
                        inputSize="large"
                        placeholder="Select User Email"
                        className="ds-box-shadow3 ds-bg-neutral100"
                        onChangeSelect={(value: any) => {
                            onChange({ key: 'user', value: value });
                        }}
                        isInvalid={state.user?.isInvalid}
                        isValid={state.user?.isValid}
                        error={state.user?.errorMessage}
                        errorClassName='ds-text-error800'
                        isSelect={true}
                        selectOption={users.map(user => ({
                            label: user.email,
                            value: user.email,
                        }))}
                        selectValue={state.user?.value}
                    />
                    <Button text="Add User" onClick={handleAddUser} className='ds-mt-10' />
                    {error && <Text text={error} className='ds-text-error600' />}
                </>
            )}
        </Col>
    );
};

export default ListEnvUsers;
