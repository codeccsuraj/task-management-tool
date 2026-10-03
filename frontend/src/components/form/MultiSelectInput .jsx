import React from "react";
import { Select } from "antd";

const MultiSelectInput = ({
    name,
    id,
    value = [],
    onChange,
    onBlur,
    options = [],
    placeholder = "Select options",
    disabled = false,
    allowClear = true,
    showSearch = false,
    className = "",
    size = "large",
    maxTagCount = "responsive",
    ...props
}) => {
    return (
        <Select
            mode="multiple"
            id={id || name}
            name={name}
            value={value || []}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            showSearch={showSearch}
            size={size}
            maxTagCount={maxTagCount}
            className={`w-100 ${className}`}
            {...props}
        />
    );
};

export default MultiSelectInput;