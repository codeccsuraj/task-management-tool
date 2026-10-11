import React, { useState } from 'react'
import Heading from '../../../components/custom/Heading'
import ButtonInput from '../../../components/form/ButtonInput'
import AddSprint from '../../../features/ticket/create/AddSprint'

const Sprint = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <Heading title='Sprint' subtitle='1 Active - 2 Planned - 6 Completed' />
                <ButtonInput
                    type="button"
                    className="btn-submit"
                    label="+ Plan new sprint"
                    onClick={() => setOpen(true)}
                />
            </div>

            <AddSprint isOpen={open} onClose={() => setOpen(false)} />
        </div>
    )
}

export default Sprint
