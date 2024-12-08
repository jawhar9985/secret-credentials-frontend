import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Col, Text, Table, Icon, Button, Modal, Row } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { RootState } from '../redux/store'; // Ensure correct import
import { useNavigate } from 'react-router-dom';
import AddUserForm from './AddUserForm';
import EditUserForm from './EditUser';

const ListOfUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isError, setIsError] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  const modalRef = useRef<ModalRefType>(null); // Ref for the Modal
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const editUserModalRef = useRef<ModalRefType>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!accessToken) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use token from Redux state
          },
        });

        console.log('Fetched users:', response.data.data); // Log fetched data
        setUsers(response.data.data);
        setIsError(false); // Clear error if the request is successful
      } catch (error: any) {
        setIsError(true);
        setError(error.response?.status === 403 
          ? 'You do not have permission to access this page' 
          : error.response?.data?.message || 'An error occurred while fetching users');
      }
    };

    fetchUsers();
  }, [accessToken]);

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'isSuperAdmin', label: 'Super Admin' },
    { key: 'actions', label: 'Actions', isCustom: true, renderCustom: (userId: any) => (
      <div className="ds-flex">
        <Icon 
          icon="pencil-alt"
          size='26'
          className="ds-mr-10" 
          onClick={() => {
            setUserId(userId.actions)
            if (editUserModalRef.current) editUserModalRef.current.onOpen()
          }}
        />
        <Icon 
          icon="x-circle"
          size='26' 
          className="ds-text-error600" 
          onClick={() => handleDelete(userId.actions)}
        />
      </div>
    )}
  ];

  // Map user data for table
  const data = users.map(user => {
    return {
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin ? 'Yes' : 'No',
      actions: user._id
    };
  });

  // Handle Edit button click
  const handleEdit = (userId: string) => {
    navigate(`/edit-user/${userId}`);
  };

  // Handle Delete button click
  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error: any) {
      setIsError(true);
      setError(error.response?.data?.message || 'An error occurred while deleting user');
    }
  };

  // Open the modal
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.onOpen();
    }
  };

  // Close the modal
  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.onClose();
    }
  };

  return (
    <div>
      <Modal
        ref={modalRef}
        withCloseIcon={true}
        onShow={() => console.log("Modal shown")}
        containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

        onExit={closeModal} // Ensure the modal can be closed
      >
        <AddUserForm />
      </Modal>
      {/* Edit Project User Role Modal */}
      <Modal
            ref={editUserModalRef}
            title="Add Environment to Project"
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            withCloseIcon={true}
            onClose={() => editUserModalRef.current?.onClose()}
          >
            <EditUserForm userId={userId} />
          </Modal>
      {isError ? (
        <Text type='type-3' className="ds-text-error600" text={error} />
      ) : (
        <Col className="ds-mt-50 ds-mb-50 ds-ml-50 ds-mr-50 ds-pt-10 ds-pb-10 ds-borad-20">
          <Row
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '10px',
      }}
    >
      <Text type='type-4' text='List Of Users' />
      
      <Button
            text="Add User"
            icon='plus-square'
            onClick={openModal} // Open modal
            className='ds-mr-40'
          />
    </Row>
          <Table
            containerClassName="ds-box-shadow3 ds-borad-20"
            headers={headers}
            data={data}
            withPagination={false} 
          />
        </Col>
      )}
    </div>
  );
};

export default ListOfUsers;
