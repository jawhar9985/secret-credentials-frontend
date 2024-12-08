import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PrivateRouterProps {
    children: React.ReactNode;
}

const PrivateRouter: React.FC<PrivateRouterProps> = ({ children }) => {
    const { accessToken,user } = useSelector((state: RootState) => state.auth);
    

    if (!accessToken && !user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default PrivateRouter;
