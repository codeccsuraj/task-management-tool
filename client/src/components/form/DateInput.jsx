import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";


const DateInput = ({
    value = null,
    onChange,
    placeholder = "Select date",
    format = "DD/MM/YYYY",
    disabled = false,
    allowClear = true,
    className = "",
    disabledDate,
}) => {
    const dateValue = value ? dayjs(value) : null;

    const handleChange = (date) => {
        if (!onChange) return;

        // Return formatted date or null
        onChange(date ? date.format("YYYY-MM-DD") : null);
    };
    return (
        <DatePicker
            value={dateValue}
            onChange={handleChange}
            placeholder={placeholder}
            format={format}
            disabled={disabled}
            allowClear={allowClear}
            disabledDate={disabledDate}
            style={{
                display : 'block',
                width : "100%",
                padding : "7px 10px"
            }}
            className={`custom-date-input ${className}`}
        />
    )
}

export default DateInput
