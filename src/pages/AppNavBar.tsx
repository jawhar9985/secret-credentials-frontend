import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IAtomIcon, Navbar } from '@piximind/ds-p-23'; // Import Navbar component
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice'; // Adjust the import path as necessary
import { RootState } from '../redux/store';

const NavbarWrapper: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const Logout: IAtomIcon = {
        icon: undefined, // Remove or set to undefined if not used
        onClick: () => {
            dispatch(logout());
            navigate('/');
        },
        className: 'logout-icon-class', // Adjust or remove this if needed
        size: '24', // Example size
    };

    // List of paths where Navbar should not be shown
    const excludedPaths = ['/', '/reset-password', '/confirm-reset-password', '*'];

    // Check if the current path is in the excludedPaths list
    const shouldShowNavbar = !excludedPaths.includes(location.pathname);

    const user = useSelector((state: RootState) => state.auth.user);

    // Define the links
    const links = [
        user?.isSuperAdmin && {
            label: 'All Projects',
            path: '/projects',
        },
        {
            label: 'My Projects',
            path: '/my-projects',
        },
        user?.isSuperAdmin &&
        {
            
                label:"List Of Users", path:"/list-of-users",
            
        }
    ].filter(Boolean); // Filter out undefined links

    return (
        <>
            {shouldShowNavbar && (
                <Navbar
                    className=""
                    withButton={false}
                    btnText=""
                    links={links}
                    withIcon={true}
                    icons={[]}
                    withOptionsList={false}
                    optionsList={{
                        selectOption: [],
                        selectValue: [],
                        containerClassName: '',
                        className: '',
                        onChangeSelect: () => {},
                    }}
                    optionsClassName=""
                    isLogout={true}
                    logout={Logout} // Ensure this is correctly interpreted
                />
            )}
        </>
    );
};

export default NavbarWrapper;
