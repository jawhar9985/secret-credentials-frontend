
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Input, Text, Col } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { useForm, IUseFormResult } from '@piximind/custom-hook';
import { RootState } from '../redux/store';
import { useNavigate, useParams } from 'react-router-dom';

interface EditProjectUserRoleProps {
  projectId: string;
  userId: string;
}

const EditProjectUserRole: React.FC<EditProjectUserRoleProps> = ({projectId,userId}) => {
  const [error, setError] = useState<string | undefined>();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  // Initialize form with validation rules
  const form = useForm({
    isRealTimeValidation: true,
    data: [
      { value: '', isRealTimeValidation: true, rules: [], key: 'role' },
    ],
  }) as IUseFormResult;

  const { state, onChange, isFormValid, onUpdateState } = form;
  const handleEditProjectUserRole = async () => {
    if (isFormValid && projectId) {
      try {
        const editProjectUserRoleDto = {
          role: state.role?.value[0],
        };
        console.log(state)

        const response = await axios.put(`http://localhost:3000/project/editprojectuserrole/${projectId}/${userId}`, editProjectUserRoleDto, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          window.location.reload()
        } else {
          setError('Failed to edit user role.');
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'An error occurred');
      }
    } else {
      setError('Please fill out all required fields correctly.');
    }
  };

  return (
    <Col className="">
      <Text text="Edit Project User Role" type="type-4" className='ds-flex ds-flex-col ds-center ds-text-primary ds-pt-50 ds-pl-110' />
        <>
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
          <Button text="Edit User Role" onClick={handleEditProjectUserRole} className='ds-mt-10' />
          {error && <Text text={error} className='ds-text-error600' />}
        </>
    </Col>
  );
};

export default EditProjectUserRole;
