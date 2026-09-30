import React from "react";

const FieldWrapper = ({
    name,
    label,
    className = "",
    children,
    formik,
    required = false,
}) => {
    const error = formik?.touched?.[name] && formik?.errors?.[name];

    return (
        <div className={className}>
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label}

                    {required && (
                        <span className="required-mark">*</span>
                    )}
                </label>
            )}

            {children}

            {error && (
                <div className="form-error text-danger">
                    {formik.errors[name]}
                </div>
            )}
        </div>
    );
};

export default FieldWrapper;