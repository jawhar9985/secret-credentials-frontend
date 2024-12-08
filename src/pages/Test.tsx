

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Text, Button, Row } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { RootState } from '../redux/store';

const MyAllprojects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isError, setIsError] = useState<boolean>(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        if (!accessToken) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/project/myprojects', {
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

  const handleAddValuesClick = (envId: string) => {
    navigate(`/add-values/${envId}`);
  };

  const handleAddUserClick = (projectId: string) => {
    navigate(`/add-project-user/${projectId}`);
  };

  const handleEditProjectUserRoleClick = (projectId: string, userId: string) => {
    navigate(`/edit-project-user-role/${projectId}/${userId}`);
  };

  const handleAddEnvironmentClick = (projectId: string) => {
    navigate(`/add-environment/${projectId}`);
  };

  const removeProjectUserClick = async (projectId: string, userObjId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/project/removeprojectuser/${projectId}/${userObjId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId
              ? { ...project, users: project.users.filter((user: any) => user._id !== userObjId) }
              : project
          )
        );
      } else {
        setError('Failed to remove user from project.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while removing the user.');
    }
  };

  const deleteEnvClick = async (envId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/project/deleteenv/${envId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        window.location.reload();
        console.log('Environment deleted successfully.');
      } else {
        setError('Failed to delete the environment.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while deleting the environment.');
    }
  };

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

  return (
    <div>
      {isError ? (
        <Text type='type-3' className="ds-text-error600" text={error} />
      ) : (
        <Col className=" ds-mb-100 ds-ml-50 ds-mr-50 ds-pt-10 ds-pb-10 ds-bg-neutral200 ds-borad-20">
          {projects.map((project) => (
            <Col key={project._id} className="ds-bg-neutral100 ds-p-10 ds-mb-10 ds-box-shadow3">
              <Row className='ds-ml-10'>
                <Text text={`${project.name}`} type="type-4" />
              </Row>
              <Text text="Owner:" />
              <Text text={`${project.owner.name} (${project.owner.email})`} />
              <Text text="Users:" />
              {(project.owner._id === currentUser._id || project.users.some((user: any) => user.role === 'Admin' && user.user._id === currentUser._id)) && (
                <Button
                  text="Add Project User"
                  onClick={() => handleAddUserClick(project._id)}
                  className="ds-mt-10"
                />
              )}
              {project.users.map((user: any) => (
                <>
                  <hr />
                  <Row>
                    <Text text={`${user.user.name} (${user.user.email}) - Role: ${user.role}`} className='ds-ml-20' />
                    {(project.owner._id === currentUser._id) && (
                      <>
                        <Button
                          text="Edit User Role"
                          onClick={() => handleEditProjectUserRoleClick(project._id, user._id)}
                          className="ds-ml-20"
                        />
                        <Button
                          text="Remove User"
                          onClick={() => removeProjectUserClick(project._id, user._id)}
                          className="ds-ml-20 ds-bg-warning900"
                        />
                      </>
                    )}
                  </Row>
                  <hr />
                </>
              ))}

              <Text text="Environments:" />
              {(project.owner._id === currentUser._id || project.users.some((user: any) => user.role === 'Admin' && user.user._id === currentUser._id)) && (
                <Button
                  text="Add Project Environment"
                  onClick={() => handleAddEnvironmentClick(project._id)}
                  className="ds-mt-8 ds-mb-10"
                />
              )}
              {project.environments.map((env: any) => (
                <Col key={env._id} className="ds-bg-neutral200 ds-p-10 ds-mb-10 ds-box-shadow3">
                  <Text text={`Environment Name: ${env.name}`} />
                  <Text text="Users:" />
                  {env.users.map((envUser: any) => (
                    <Text key={envUser._id} text={`${envUser.name} (${envUser.email})`} />
                  ))}
                  {(project.owner._id === currentUser._id || project.users.some((user: any) => user.role === 'Admin' && user.user._id === currentUser._id)) && (
                      <Button
                        text="Add/Edit Values"
                        onClick={() => handleAddValuesClick(env._id)}
                        className="ds-mt-10"
                      />
                      )}
                  
                      <Button
                        text="Download Env File"
                        onClick={() => downloadEnvFile(env._id)}
                        className="ds-mt-10 ds-bg-success600"
                      />
                  
                  
                  {(project.owner._id === currentUser._id) && (
                    <Button
                      text="Delete Environment"
                      onClick={() => deleteEnvClick(env._id)}
                      className="ds-mt-10 ds-bg-warning900"
                    />
                  )}
                </Col>
              ))}
            </Col>
          ))}
        </Col>
      )}
    </div>
  );
};

export default MyAllprojects;

