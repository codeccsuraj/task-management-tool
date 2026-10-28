import React from 'react'
import { Button, Tooltip, Divider } from 'antd'
import { toolbarConfig } from './toolbar'

const EditorToolbar = ({
    editor,
    items = [],
    disabled = false,
}) => {
    if (!editor) return null
    return (
        <div className="rich-text-toolbar">
            {items.map((item, index) => {
                if (item === 'divider') {
                    return (
                        <Divider
                            key={`divider-${index}`}
                            type="vertical"
                        />
                    )
                }

                const config = toolbarConfig[item]

                if (!config) return null

                const isActive = config.isActive?.(editor)
                const isDisabled =
                    disabled || config.disabled?.(editor) || false

                return (
                    <Tooltip
                        title={config.title}
                        key={item}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={config.icon}
                            disabled={isDisabled}
                            className={
                                isActive
                                    ? 'rich-text-toolbar-active'
                                    : ''
                            }
                            onClick={() => config.command(editor)}
                        />
                    </Tooltip>
                )
            })}
        </div>
    )
}

export default EditorToolbar
