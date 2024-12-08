import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Icon, Modal, Row } from '@piximind/ds-p-23';
import AddKeys from './AddKeys';

interface KeyValue {
  key: string;
  value: string;
}

interface Environment {
  _id: string;
  name: string;
}

interface Project {
  owner:string
  name: string;
  _id: string;
  environments: Environment[];
}

const AddEditValues: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [envKeyValues, setEnvKeyValues] = useState<{ [envId: string]: KeyValue[] }>({});
  const [error, setError] = useState<string | null>(null);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const addKeysModalRef = useRef<ModalRefType>(null);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/getoneproject/${projectId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProject(response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'An error occurred while fetching the project.');
      }
    };

    fetchProject();
  }, [projectId, accessToken]);

  useEffect(() => {
    const fetchEnvKeyValues = async () => {
      if (!project) return;

      try {
        const keyValues: { [envId: string]: KeyValue[] } = {};
        for (const env of project.environments) {
          const response = await axios.get(`http://localhost:3000/project/envkeysvalues/${env._id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          keyValues[env._id] = response.data.data;
        }
        setEnvKeyValues(keyValues);
      } catch (error: any) {
        setError(error.response?.data?.message || 'An error occurred while fetching environment key-values.');
      }
    };

    fetchEnvKeyValues();
  }, [project, accessToken]);

  const handleInputChange = (envId: string, key: string, value: string) => {
    setEnvKeyValues((prevValues) => {
      const updatedEnv = [...(prevValues[envId] || [])];
      const index = updatedEnv.findIndex((item) => item.key === key);
      if (index !== -1) {
        updatedEnv[index] = { key, value };
      } else {
        updatedEnv.push({ key, value });
      }
      return { ...prevValues, [envId]: updatedEnv };
    });
  };

  const handleSaveAll = async () => {
    try {
      const promises = Object.keys(envKeyValues).map((envId) =>
        axios.put(
          `http://localhost:3000/project/addenvvalues/${envId}`,
          { keysValues: envKeyValues[envId] },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );
      await Promise.all(promises);
      alert('All values updated successfully');
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while saving values.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit Environment Values</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {project ? (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>{currentUser?._id === project.owner || currentUser?.isSuperAdmin === true ? <Button text="Key(s)" onClick={()=>{
            if (addKeysModalRef.current) addKeysModalRef.current.onOpen()
          }} icon="plus-square" size='30'  />: <>Key(s)</>}</th>
                  {project.environments.map((env) => (
                    <th key={env._id}>{env.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.environments.length > 0 &&
                  envKeyValues[project.environments[0]._id]?.map((kv) => (
                    <tr key={kv.key}>
                      <td>{kv.key}</td>
                      {project.environments.map((env) => (
                        <td key={env._id}>
                          <input
                            type="text"
                            className="form-control"
                            value={envKeyValues[env._id]?.find((item) => item.key === kv.key)?.value || ''}
                            onChange={(e) => handleInputChange(env._id, kv.key, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary" onClick={handleSaveAll}>Save All</button>

          
          <Modal
            ref={addKeysModalRef}
            title="Add Keys To Project"
            withCloseIcon={true}
            containerClassName='ds-w-100 ds-h-100 ds-flex-col ds-center'

            onClose={() => addKeysModalRef.current?.onClose()}
          >
            <AddKeys projectId={projectId}/>
          </Modal>

        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AddEditValues;
