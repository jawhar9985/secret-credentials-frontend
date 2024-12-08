import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { persistor } from '../redux/store'; // Import persistor to clear persisted storage
import { Button } from '@piximind/ds-p-23';

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication state from Redux
        dispatch(logout());

        // Clear persisted storage
        persistor.purge();

        // Redirect to login page
        navigate('/');
    };

    return (
        <Button onClick={handleLogout} text="Logout"/>
    );
};

export default Logout;
