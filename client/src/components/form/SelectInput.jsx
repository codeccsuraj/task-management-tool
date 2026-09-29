import React from "react";
import { Select } from "antd";

const SelectInput = ({
    name,
    id,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = "Select an option",
    disabled = false,
    allowClear = false,
    showSearch = false,
    className = "",
    size = "large",
    ...props
}) => {
    return (
        <Select
            id={id || name}
            name={name}
            value={value || undefined}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            showSearch={showSearch}
            size={size}
            className={`w-100 ${className}`}
            {...props}
        />
    );
};

export default SelectInput;

