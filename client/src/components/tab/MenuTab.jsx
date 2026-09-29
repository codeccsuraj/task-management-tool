import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Tabs } from "antd";
import { useSearchParams } from "react-router-dom";

const MenuTab = ({
    items,
    activeKey,
    defaultActiveKey,
    onChange,
    urlParam,
    variant = "line",
    size = "middle",
    extra,
    destroyInactive = false,
    className = "",
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const firstKey = items.find((item) => !item.disabled)?.key;

    const [innerKey, setInnerKey] = useState(
        defaultActiveKey ?? firstKey
    );

    const urlKey = urlParam
        ? searchParams.get(urlParam)
        : null;

    const validUrlKey = items.some(
        (item) => item.key === urlKey && !item.disabled
    )
        ? urlKey
        : null;

    const currentKey =
        activeKey ??
        validUrlKey ??
        innerKey ??
        firstKey;

    useEffect(() => {
        const exists = items.some(
            (item) => item.key === innerKey && !item.disabled
        );

        if (!exists) {
            setInnerKey(firstKey);
        }
    }, [items, innerKey, firstKey]);

    const handleChange = (key) => {
        if (activeKey === undefined) {
            setInnerKey(key);
        }

        if (urlParam) {
            const nextParams = new URLSearchParams(searchParams);

            nextParams.set(urlParam, key);

            setSearchParams(nextParams, {
                replace: true,
            });
        }

        onChange?.(key);
    };

    const antItems = useMemo(
        () =>
            items.map(
                ({
                    key,
                    label,
                    icon,
                    count,
                    disabled,
                    content,
                }) => ({
                    key,
                    disabled,

                    label: (
                        <span className="menu-tab__label">
                            {icon && (
                                <span className="menu-tab__icon">
                                    {icon}
                                </span>
                            )}

                            <span className="menu-tab__text">
                                {label}
                            </span>

                            {count !== undefined && (
                                <Badge
                                    count={count}
                                    showZero
                                    overflowCount={99}
                                    className="menu-tab__badge"
                                />
                            )}
                        </span>
                    ),

                    children: content,
                })
            ),
        [items]
    );

    return (
        <Tabs
            className={`menu-tab menu-tab--${variant} ${className}`}
            items={antItems}
            activeKey={currentKey}
            onChange={handleChange}
            size={size}
            tabBarExtraContent={extra}
            destroyOnHidden={destroyInactive}
            type="line"
        />
    );
};

MenuTab.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
            icon: PropTypes.node,
            count: PropTypes.number,
            disabled: PropTypes.bool,
            content: PropTypes.node,
        })
    ).isRequired,

    activeKey: PropTypes.string,

    defaultActiveKey: PropTypes.string,

    onChange: PropTypes.func,

    urlParam: PropTypes.string,

    variant: PropTypes.oneOf([
        "line",
        "pill",
    ]),

    size: PropTypes.oneOf([
        "small",
        "middle",
        "large",
    ]),

    extra: PropTypes.node,

    destroyInactive: PropTypes.bool,

    className: PropTypes.string,
};

export default MenuTab;