import React from 'react'
import SvgIcon from '../../assets/SvgIcon'

const ButtonInput = ({
    type = "button",
    onClick,
    loading = false,
    label = "",
    className = ""
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`btn-base ${className}`}
        >
            <span>{label} {loading && <SvgIcon icon="circle-spin" color='#f2f2f2' size={25} />}</span>
        </button>
    )
}

export default ButtonInput
