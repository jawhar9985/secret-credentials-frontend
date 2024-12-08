import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface SuperAdminRouterProps {
    children: React.ReactNode;
}

const SuperAdminRouter: React.FC<SuperAdminRouterProps> = ({ children }) => {
    const { accessToken, user } = useSelector((state: RootState) => state.auth);

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    if (!user || !user.isSuperAdmin) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{children}</>;
}

export default SuperAdminRouter;
