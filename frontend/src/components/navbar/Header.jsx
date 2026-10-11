import React from 'react'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../features/auth/slice/authSlice';
import Swal from 'sweetalert2'


const Header = () => {
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Log out?',
            text: 'You will need to log in again to access your workspace.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#2F6F4E',
            reverseButtons: true,
        })

        if (!result.isConfirmed) return

        try {
            await logout().unwrap()   // wait for the API call to finish
            dispatch(clearUser())
            navigate('/login', { replace: true })
        } catch (error) {
            console.error('Error while logging out', error)
            Swal.fire({
                title: 'Logout failed',
                text: 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonColor: '#2F6F4E',
            })
        }
    }

    const items = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const onMenuClick = ({ key }) => {
        if (key === 'profile') navigate(`/profile/${user.id}`)
        if (key === 'logout') handleLogout()
    }

    return (
        <nav className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 py-2">
            {/* Breadcrumbs */}
            <div className="small">
                <span className="fw-bold text-dark">Task</span>
                <span className="text-muted">page</span>
            </div>

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">
                <div className="input-group input-group-sm" style={{ width: '220px' }}>
                    <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control bg-light border-start-0"
                        placeholder="Search tickets…"
                    />
                </div>

                {/* User dropdown */}
                <Dropdown
                    menu={{ items, onClick: onMenuClick }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div
                        role="button"
                        className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-white fw-bold"
                        style={{ width: '32px', height: '32px', fontSize: '12px', cursor: 'pointer' }}
                    >
                        RS
                    </div>
                </Dropdown>
            </div>
        </nav>
    )
}

export default Header
