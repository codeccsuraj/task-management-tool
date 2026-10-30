import React, { forwardRef } from 'react';
import { Button } from 'antd';
/**
 * Themed antd button.
 *
 * variant: 'default' | 'success' | 'secondary' | 'cancel' | 'danger' | 'text'
 *
 * Backward compatible with the old API:
 *   <ButtonInput type="submit" label="Save" loading={isSaving} onClick={...} className="..." />
 * `type` is still the native HTML type (button | submit | reset).
 *
 * Customize per instance with CSS variables, e.g.
 *   <ButtonInput variant="success" style={{ '--btn-bg': '#1B2420', '--btn-bg-hover': '#2A362F' }} />
 */
const VARIANT_CLASS = {
    default: 'btn-input--default',
    success: 'btn-input--success',
    secondary: 'btn-input--secondary',
    cancel: 'btn-input--cancel',
    danger: 'btn-input--danger',
    text: 'btn-input--text',
};

const ButtonInput = ({
    variant = 'default',
    type = 'button', // native html type
    onClick,
    loading = false,
    disabled = false,
    label = '',
    children,
    icon,
    size = 'middle', // 'small' | 'middle' | 'large'
    block = false,
    className = '',
    style,
    ...rest
}) => {
    const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default;

    return (
        <Button
            htmlType={type}
            type={variant === 'text' ? 'text' : 'default'}
            onClick={onClick}
            loading={loading}
            disabled={disabled}
            icon={icon}
            size={size}
            block={block}
            style={style}
            className={`btn-input ${variantClass} ${className}`.trim()}
            {...rest}
        >
            {children ?? label}
        </Button>
    );
}

export default ButtonInput;