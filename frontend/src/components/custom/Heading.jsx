import React from 'react'

const Heading = ({
    title = "",
    subtitle = ""
}) => {
    return (
        <div className='d-flex flex-column'>
            <span className='h4 p-0 m-0'>{title}</span>
            {(subtitle && subtitle?.trim() !== "") && <span className='text-secondary'>{subtitle}</span>}
        </div>
    )
}

export default Heading
