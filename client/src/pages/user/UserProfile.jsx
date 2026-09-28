import React, { Suspense, useState } from 'react'
import Heading from '../../components/custom/Heading'
import ButtonInput from '../../components/form/ButtonInput'
import MenuTab from '../../components/tab/MenuTab'
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'

const BasicInfo = React.lazy(() => import("./components/BasicInfo"))
const UpdateUser = React.lazy(() => import("../../features/user/update/UpdateUser"))

const UserProfile = () => {
    const [tab, setTab] = useState("profile")
    const items = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            content: (
                <Suspense fallback={<p>Page is loading</p>}>
                    <BasicInfo />
                </Suspense>
            )
        },
        {
            key: 'edit',
            label: 'Edit profile',
            icon: <EditOutlined />,
            content: (
                <Suspense fallback={<p>Page is loading</p>}>
                    <UpdateUser />
                </Suspense>
            )
        },
        { key: 'security', label: 'Security', icon: <LockOutlined />, content: <p>this is security</p> },
    ]
    return (
        <div>
            <div className='d-flex justify-content-between align-items-start mb-3'>
                <Heading title="My Profile" subtitle="Your account details and activity" />

                <ButtonInput
                    label='Edit profile'
                    className='btn-base btn-outline'
                    onClick={() => setTab("edit")}
                />
            </div>
            <div>
                <MenuTab items={items} urlParam={tab} />
            </div>
        </div>
    )
}

export default UserProfile
