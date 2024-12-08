import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Input, Text, Col } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useNavigate } from 'react-router-dom';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { RootState } from '../redux/store';

const CreateProjectForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | undefined>();
    const [numKeys, setNumKeys] = useState<number>(0);
    const [numEnvironments, setNumEnvironments] = useState<number>(0);
    const [keys, setKeys] = useState<string[]>([]);
    const [environments, setEnvironments] = useState<string[]>([]);

    const token = useSelector((state: RootState) => state.auth.accessToken);

    // Initialize form with validation rules
    const form = useForm({
        isRealTimeValidation: true,
        data: [
            {
                value: '',
                isRealTimeValidation: true,
                rules: [
                    { priority: 1, function: 'isNotEmpty', messageError: 'Project Name is required' }
                ],
                key: 'name'
            },
            {
                value: '',
                isRealTimeValidation: true,
                rules: [],
                key: 'keys'
            }
        ]
    }) as IUseFormResult;

    const { state, onChange, isFormValid } = form;

    // Handle project creation
    const handleCreateProject = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Form state on create project:', state);

        if (isFormValid) {
            try {
                const name = state.name?.value as string;
                const createProjectDto = {
                    name,
                    keys,
                    environment: environments.map(env => ({ name: env }))
                };

                const response = await axios.post('http://localhost:3000/project', createProjectDto, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Response from server:', response.data);

                if (response.status === 200) {
                    window.location.reload()
                } else {
                    setError('Project creation failed. Please try again.');
                }
            } catch (error: any) {
                console.error('Error during project creation:', error);
                setError(error.response?.data?.message || 'An error occurred');
            }
        } else {
            setError('Please fill out all required fields.');
        }
    };

    const handleNumKeysChange = () => {
        const newNumKeys = numKeys+1
        setNumKeys(newNumKeys);
        console.log(newNumKeys)
        setKeys(new Array(newNumKeys).fill(''));
    };

    const handleKeyChange = (index: number, value: string) => {
        const newKeys = [...keys];
        newKeys[index] = value;
        setKeys(newKeys);
    };

    const handleNumEnvironmentsChange = () => {
        const newNumEnvrionments = numEnvironments + 1;
        setNumEnvironments(newNumEnvrionments);
        setEnvironments(new Array(newNumEnvrionments).fill(''));
    };

    const handleEnvironmentChange = (index: number, value: string) => {
        const newEnvironments = [...environments];
        newEnvironments[index] = value;
        setEnvironments(newEnvironments);
    };

    return (
        <Col className=' ds-borad-20 '>
            <Text text="Create Project" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
            <Col className="ds-pb-20">
                <Input
                    label='Project Name'
                    type="text"
                    inputSize="large"
                    placeholder="Project Name"
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
            <Col className="ds-pb-20">
                <Button
                text="Add Key Input"
                icon="plus-square"
                onClick={handleNumKeysChange}
                />
                {keys.map((key, index) => (
                    <Input
                        key={index}
                        type="text"
                        inputSize="large"
                        placeholder={`Key ${index + 1}`}
                        className="ds-box-shadow3 ds-bg-neutral100"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeyChange(index, e.target.value)}
                        value={key}
                    />
                ))}
            </Col>
            <Col className="ds-pb-20">
                <Button
                icon='plus-square'
                text='Add Envrionment Input'
                onClick={handleNumEnvironmentsChange}
                />
                {environments.map((env, index) => (
                    <Input
                        key={index}
                        type="text"
                        inputSize="large"
                        placeholder={`Environment ${index + 1}`}
                        className="ds-box-shadow3 ds-bg-neutral100"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEnvironmentChange(index, e.target.value)}
                        value={env}
                    />
                ))}
            </Col>
            {error && <Text className='ds-text-error600' text={error} />}
            <Col className="ds-pt-10">
                <Row className="ds-p-15">
                    <Button
                        text="Create Project"
                        className='ds-mr-10'
                        onClick={handleCreateProject}
                    />
                </Row>
            </Col>
        </Col>
    );
}

export default CreateProjectForm;
