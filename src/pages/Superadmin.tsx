import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Text } from '@piximind/ds-p-23';
import '@piximind/ds-p-23/lib/main.css';
import { RootState } from '../redux/store'; // Ensure correct import

const Superadmin: React.FC = () => {
  // Access the user data from Redux state
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      {user ? (
        <Col className="ds-mb-50 ds-ml-50 ds-mr-50 ds-pt-10 ds-pb-10 ds-bg-neutral200 ds-borad-20">
          <Col className="ds-p-20 ds-bg-neutral100 ds-box-shadow3">
            <Text text="Welcome to the Super Admin Dashboard" className='ds-text-primary' type="type-4"  />
            <Text text={`Name: ${user.name}`} />
            <Text text={`Email: ${user.email}`} />
            <Text text={`Super Admin: ${user.isSuperAdmin ? 'Yes' : 'No'}`} />
          </Col>
        </Col>
      ) : (
        <Text type='type-3' className="ds-text-error600" text="User not found" />
      )}
    </div>
  );
};

export default Superadmin;
