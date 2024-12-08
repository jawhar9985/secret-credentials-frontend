import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Row, Input, Text, Col, Container } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { RootState } from '../redux/store';
import { useNavigate, useParams } from 'react-router-dom';

const AddEnvironmentForm: React.FC = ({projectId}) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | undefined>();
    const token = useSelector((state: RootState) => state.auth.accessToken);

    const form = useForm({
        isRealTimeValidation: true,
        data: [
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: 'isNotEmpty', messageError: 'Environment Name is required' }
                ],
                key: 'name'
            }
        ]
    }) as IUseFormResult;

    const { state, onChange, isFormValid } = form;

    const handleAddEnvironment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isFormValid) {
            try {
                const environmentDto = {
                    name: state.name?.value as string,
                };

                const response = await axios.put(
                    `http://localhost:3000/project/addenv/${projectId}`,
                    environmentDto,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                if (response.status === 200) {
                    window.location.reload();
                } else {
                    setError('Failed to add environment. Please try again.');
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred while adding the environment.');
            }
        } else {
            setError('Please fill out the required field.');
        }
    };

    return (
        <Col className=' ds-borad-20'>
            <Text text="Add Environment" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
            <Col className="ds-pb-20">
                <Input
                    label='Environment Name'
                    type="text"
                    inputSize="large"
                    placeholder="Environment Name"
                    className="ds-box-shadow3 ds-bg-neutral100"
                    listIcons={[{ icon: "edit", isLeft: true, color: "#79c300", size: 25 }]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ key: 'name', value: e.target.value })}
                    value={state.name?.value as string}
                    isInvalid={state.name?.isInvalid}
                    isValid={state.name?.isValid}
                    error={state.name?.errorMessage}
                    errorClassName='ds-text-error800'
                />
            </Col>
            {error && <Text className='ds-text-error600' text={error} />}
            <Col className="ds-pt-10">
                <Row className="ds-p-15">
                    <Button
                        text="Add Environment"
                        className='ds-mr-10'
                        onClick={handleAddEnvironment}
                    />
                </Row>
            </Col>
        </Col>
    );
};

export default AddEnvironmentForm;
