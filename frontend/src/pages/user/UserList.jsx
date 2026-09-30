import React, { useState } from 'react'
import Heading from '../../components/custom/Heading'
import ButtonInput from '../../components/form/ButtonInput'
import CreateUser from '../../features/user/create/CreateUser'
import { useGetUsersQuery } from '../../features/user/api/userApi'

const UserList = () => {
    const [showForm, setShowForm] = useState(false);
    const { data } = useGetUsersQuery();

    console.log("This is data", data)
    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <Heading title="Team" subtitle='' />
                <ButtonInput
                    label="Add new"
                    className="btn-base btn-outline"
                    onClick={() => setShowForm(true)}
                />
            </div>

            <CreateUser isOpen={showForm} onClose={() => setShowForm(false)} />
        </div>
    )
}

export default UserList
