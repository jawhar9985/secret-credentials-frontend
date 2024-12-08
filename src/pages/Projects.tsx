import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Text, Table, Button, Row, Icon, Modal } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { RootState } from '../redux/store';
import AddEnvironmentForm from './AddEnvironment';
import CreateProjectForm from './CreateProjectForm';
import AddProjectUser from './AddProjectUser';
import EditProjectUserRole from './EditProjectUserRole';
import ListEnvUsers from './ListEnvUsers';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  owner: User;
  users: Array<{
    user: User;
    role: string;
  }>;
  environments: Array<{
    _id: string;
    name: string;
    users: User[];
  }>;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isError, setIsError] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [envId, setEnvId] = useState<string>('');

  const [currentProjectIdUser, setCurrentProjectIdUser] = useState<string>('');
  const [currentProjectIdUserRole, setCurrentProjectIdUserRole] = useState<string>('');
  const [envUsers, setEnvUsers] = useState<User[]>([])
  const [currentUserIdUserRole, setCurrentUserIdUserRole] = useState<string>('');
  const [hoveredEnvId, setHoveredEnvId] = useState<string | null>(null);
  

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();


  // Modal references
  const addUserModalRef = useRef<ModalRefType>(null);
  const addProjectModalRef = useRef<ModalRefType>(null);
  const addEnvironmentModalRef = useRef<ModalRefType>(null);
  const editProjectUserRoleModalRef = useRef<ModalRefType>(null);
  const editEnvUsersModalRef = useRef<ModalRefType>(null);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        if (!accessToken) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/project/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProjects(response.data.data);
        setIsError(false);
      } catch (error: any) {
        setIsError(true);
        setError(error.response?.status === 403
          ? 'You do not have permission to access this page'
          : error.response?.data?.message || 'An error occurred while fetching projects');
      }
    };

    fetchMyProjects();
  }, [accessToken]);

  const downloadEnvFile = async (envId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/project/stream-file/${envId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob',
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `.env`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setError('Failed to download the environment file.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while downloading the environment file.');
    }
  };

  const headers = [
    { key: 'name', label: 'Project Name' },
    { key: 'owner', label: 'Owner' },
    {
      key: 'environments', label:'Environments', isCustom: true, renderCustom: ({ environments }: { environments: Project['environments'] }) => (
        <>
          {environments.environments.map(env => (
            <div
              key={env._id}
              className="ds-flex ds-align-items-center ds-mb-10"
              onMouseEnter={() => setHoveredEnvId(env._id)}
              onMouseLeave={() => setHoveredEnvId(null)}
              style={{ position: 'relative' }}
            >
              <Text text={env.name} className='' />
    
              {hoveredEnvId === env._id && (
                <>
                  {(
                    // Check if currentUser is in env.users
                    env.users.some(user => user._id === currentUser?._id) ||
                    // Check if currentUser is in environments.users
                    environments.users.some(user => user.user._id === currentUser?._id) ||
                    // Check if currentUser is the owner
                    (environments.ownerId?._id === currentUser?._id) ||
                    // Check if currentUser is a super admin
                    currentUser?.isSuperAdmin === true
                  ) && (
                    <Icon
                      className="ds-ml-10"
                      icon="document-download"
                      size="20"
                      onClick={() => downloadEnvFile(env._id)}
                    />
                  )}
    
                  {(environments.ownerId?._id === currentUser?._id || currentUser?.isSuperAdmin === true) && (
                    <Icon
                      className='ds-ml-10'
                      icon='users'
                      size="20"
                      onClick={() => {
                        setEnvUsers(env.users);
                        setEnvId(env._id);
                        if (editEnvUsersModalRef.current) editEnvUsersModalRef.current.onOpen();
                      }}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )
    }
    ,
    {
      key: 'users', label: 'Users', isCustom: true, renderCustom: ({ users }: { users: { users: Project['users']; projectId: string } }) => (
        <>
          {users.users.map(user => (
            <div key={user.user._id} className="ds-flex ds-align-items-center ds-mb-10">
              <Text className="ds-mr-10" text={`(${user.user.email}) - ${user.role}`} />
              {(users.ownerId._id === currentUser._id) && (

                <>
                  <Icon
                    icon="pencil-alt"
                    size='20'
                    className="ds-mr-10"
                    onClick={() => {
                      setCurrentProjectIdUserRole(users.projectId);
                      setCurrentUserIdUserRole(user._id)
                      if (editProjectUserRoleModalRef.current) editProjectUserRoleModalRef.current.onOpen();
                    }}
                  />
                  <Icon
                    icon='icon-user-remove'
                    size='20'
                    className="ds-text-error600"
                    onClick={() => removeProjectUserClick(users.projectId, user._id)}
                  />
                </>)}
            </div>
          ))}
        </>
      )
    },
    {
      key: 'actions', label: 'Actions', isCustom: true, renderCustom: (projectId) => (
        <Row>
          {(projectId.actions.ownerId === currentUser._id) && (
            <Icon
              icon='users'
              size='25'
              className="ds-ml-10"
              onClick={() => {
                setCurrentProjectIdUser(projectId.actions.projectId);
                if (addUserModalRef.current) addUserModalRef.current.onOpen();
              }}
            />)}
          {
            (projectId.actions.ownerId === currentUser._id ||
              currentUser.isSuperAdmin === true ||
              projectId.actions.users.some(user => {
                const isAdmin = user.user._id === currentUser._id && user.role === 'admin';
                return isAdmin;
              })
            ) && (
              <Icon
                icon="key"
                size="25"
                className="ds-ml-10"
                onClick={() => handleAddValuesClick(projectId.actions.projectId)}
              />
            )
          }

          {(projectId.actions.ownerId === currentUser._id || currentUser.isSuperAdmin === true) && (
            <Icon
              icon='plus-square'
              size='25'
              onClick={() => {
                setCurrentProjectId(projectId.actions.projectId);
                if (addEnvironmentModalRef.current) addEnvironmentModalRef.current.onOpen();
              }}
            />)}
          {(projectId.actions.ownerId === currentUser._id || currentUser.isSuperAdmin === true) && (

            <Icon
              icon='x-circle'
              size='25'
              className="ds-ml-10 ds-text-error600"
              onClick={() => deleteProject(projectId.actions.projectId)}
            />)}
        </Row>
      )
    }
  ];

  const data = projects.map(project => ({
    name: project.name,
    owner: `${project.owner.name} (${project.owner.email})`,
    environments: { users: project.users, environments: project.environments, ownerId: project.owner },
    users: { users: project.users, projectId: project._id, ownerId: project.owner },
    actions: { projectId: project._id, ownerId: project.owner._id, users: project.users }
  }));


  const removeProjectUserClick = async (projectId: string, userId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/project/removeprojectuser/${projectId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        setError('Failed to delete the user.');
        setIsError(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while deleting the user.');
      setIsError(true);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/project/deleteproject/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
      } else {
        setError('Failed to delete the project.');
        setIsError(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while deleting the project.');
      setIsError(true);
    }
  };

  const handleAddValuesClick = (projectId: string) => {
    navigate(`/add-edit-values/${projectId}`);
  };

  return (
    <div>
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
      <Text type='type-4' text='List of All Projects' />
      <Button
        text='Create Project'
        icon='plus-square'
        onClick={() => {
          setCurrentProjectId('');
          if (addProjectModalRef.current) addProjectModalRef.current.onOpen();
        }}
        className='ds-mr-40'
      />
    </Row>
          <Table
            containerClassName="ds-box-shadow3 ds-borad-20"
            headers={headers}
            data={data}
            withPagination={false}
          />
          


          {/* Add Project Modal */}
          <Modal
            ref={addProjectModalRef}
            title="Create New Project"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            onClose={() => addProjectModalRef.current?.onClose()}
          >
            <CreateProjectForm />
          </Modal>

          {/* Add User Modal */}
          <Modal
            ref={addUserModalRef}
            title="Add User to Project"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'
            onClose={() => addUserModalRef.current?.onClose()}
          >
            <AddProjectUser projectId={currentProjectIdUser} />
          </Modal>

          {/* Add Environment Modal */}
          <Modal
            ref={addEnvironmentModalRef}
            title="Add Environment to Project"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            onClose={() => addEnvironmentModalRef.current?.onClose()}
          >
            <AddEnvironmentForm projectId={currentProjectId} />
          </Modal>

          {/* Edit Project User Role Modal */}
          <Modal
            ref={editProjectUserRoleModalRef}
            title="Add Environment to Project"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            onClose={() => editProjectUserRoleModalRef.current?.onClose()}
          >
            <EditProjectUserRole projectId={currentProjectIdUserRole} userId={currentUserIdUserRole} />
          </Modal>
          <Modal
            ref={editEnvUsersModalRef}
            title="Edit Env Users"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            onClose={() => editEnvUsersModalRef.current?.onClose()}
          >
            <ListEnvUsers envUsers={envUsers} envId={envId} />
          </Modal>
        </Col>
      )}
    </div>
  );
};

export default Projects;
