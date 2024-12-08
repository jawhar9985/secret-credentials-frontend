import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ForceRedirectProps {
    children: React.ReactNode;
}

const ForceRedirect: React.FC<ForceRedirectProps> = ({ children }) => {
    const { accessToken, user } = useSelector((state: RootState) => state.auth);

    // Redirect authenticated users to their respective dashboards
    if (accessToken) {
            return <Navigate to="/my-projects" replace />;
        
    }

    return <>{children}</>;
};

export default ForceRedirect;
