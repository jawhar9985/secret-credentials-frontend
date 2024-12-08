import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Input, Text, Col } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { RootState } from '../redux/store';
import { useNavigate, useParams } from 'react-router-dom';

const AddProjectUser: React.FC = ({projectId}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const form = useForm({
    isRealTimeValidation: true,
    data: [
      { value: '', isRealTimeValidation: true, rules: [], key: 'user' },
      { value: '', isRealTimeValidation: true, rules: [], key: 'role' },
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
    if (isFormValid && projectId) {
      try {
        const addProjectUserDto = {
          email: state.user?.value[0],
          role: state.role?.value[0],
        };
        console.log(state)

        const response = await axios.put(`http://localhost:3000/project/addprojectuser/${projectId}`, addProjectUserDto, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          window.location.reload()
        } else {
          setError('Failed to add user.');
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'An error occurred');
      }
    } else {
      setError('Please fill out all required fields correctly.');
    }
  };

  return (
    <Col className="  ds-borad-20">
      <Text text="Add User to Project" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
      {isLoading ? (
        <Text text="Loading..." />
      ) : (
        <>
          <Input
            label="Select User"
            type="text"
            inputSize="large"
            placeholder="Select User Email"
            className="ds-box-shadow3 ds-bg-neutral100"
            onChangeSelect={(value:any) => {
                console.log(value)
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
          <Input
            label="Select Role"
            type="text"
            inputSize="large"
            placeholder="Select Role In Project"
            className="ds-box-shadow3 ds-bg-neutral100"
            onChangeSelect={(value:any) => {
                console.log(value)
              onChange({ key: 'role', value: value });
            }}
            isInvalid={state.role?.isInvalid}
            isValid={state.role?.isValid}
            error={state.role?.errorMessage}
            errorClassName='ds-text-error800'
            isSelect={true}
            selectOption={[
              { label: 'Admin', value: 'admin' },
              { label: 'Guest', value: 'guest' }
            ]}
            selectValue={state.role?.value}
          />
          <Button text="Add User" onClick={handleAddUser} className='ds-mt-10' />
          {error && <Text text={error} className='ds-text-error600' />}
        </>
      )}
    </Col>
  );
};

export default AddProjectUser;
