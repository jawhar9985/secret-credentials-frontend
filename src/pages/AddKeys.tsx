import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Input, Text, Col, Row } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { RootState } from '../redux/store';

interface AddKeysProps {
    projectId: string;  // Project ID to associate the keys with
}

const AddKeys: React.FC<AddKeysProps> = ({ projectId }) => {
    const [numKeys, setNumKeys] = useState<number>(0);
    const [keys, setKeys] = useState<string[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const token = useSelector((state: RootState) => state.auth.accessToken);

    const handleNumKeysChange = () => {
        const newNumKeys = numKeys+1
        setNumKeys(newNumKeys);
        console.log(newNumKeys)
        setKeys(new Array(newNumKeys).fill(''));
    };

    // Handle key input change
    const handleKeyChange = (index: number, value: string) => {
        const newKeys = [...keys];
        newKeys[index] = value;
        setKeys(newKeys);
    };

    // Handle form submission
    const handleAddKeys = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (keys.some(key => !key)) {
            setError('All key fields must be filled.');
            return;
        }

        try {
            const createKeysDto = {
                keys
            };

            const response = await axios.put(`http://localhost:3000/project/add-keys/${projectId}`, createKeysDto, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                window.location.reload()
            } else {
                setError('Failed to add keys. Please try again.');
            }
        } catch (error: any) {
            console.error('Error during adding keys:', error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Col className='ds-border-20'>
            <Text text="Add Keys" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
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
            {error && <Text className='ds-text-error600' text={error} />}
            {success && <Text className='ds-text-success600' text={success} />}
            <Col className="ds-pt-10">
                <Row className="ds-p-15">
                    <Button
                        text="Add Keys"
                        className='ds-mr-10'
                        onClick={handleAddKeys}
                    />
                </Row>
            </Col>
        </Col>
    );
}

export default AddKeys;
