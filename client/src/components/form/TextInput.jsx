import React from 'react'

const TextInput = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder = "Enter your input",
    className = "",
    onBlur
}) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
            className={`form-control ${className}`}
        />
    )
}

export default TextInput
