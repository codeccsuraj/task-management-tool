import React from 'react'
import { Image, Flex, Tooltip, Card, Typography } from 'antd';
import {
    DeleteOutlined,
    FileImageOutlined,
} from '@ant-design/icons';

const { Text } = Typography
const UploadedFilesPreview = ({
    files = [],
    onRemove,
}) => {
    if (!files.length) return null;
    return (
        <div className="uploaded-files-preview mt-3">
            <div className="d-flex align-items-center gap-2 mb-2">
                <FileImageOutlined className="text-secondary" />

                <span className="fw-semibold small">
                    Attachments ({files.length})
                </span>
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Flex wrap="wrap" gap={10} className="attachment-list">
                    {files.map((file, idx) => {
                        const previewUrl = file.previewUrl
                        const fileName = file.name || 'Untitled image'
                        const fileSize = file.size

                        return (
                            <Card
                                key={file.id || idx}
                                size="small"
                                className="attachment-card"
                                styles={{
                                    body: { padding: 8 },
                                }}
                            >
                                <Flex gap={10} align="center">
                                    {/* Image thumbnail */}
                                    <Image
                                        src={previewUrl}
                                        alt={fileName}
                                        width={64}
                                        height={56}
                                        preview={{
                                            mask: 'Preview',
                                        }}
                                        className="attachment-thumbnail"
                                        fallback=""
                                    />

                                    {/* Attachment details */}
                                    <Flex
                                        vertical
                                        flex={1}
                                        gap={3}
                                        style={{ minWidth: 0 }}
                                    >
                                        <Tooltip title={fileName}>
                                            <Text
                                                strong
                                                ellipsis
                                                className="attachment-name"
                                            >
                                                {fileName}
                                            </Text>
                                        </Tooltip>

                                        <Text type="secondary" className="attachment-size">
                                            {fileSize
                                                ? `${(fileSize / 1024).toFixed(1)} KB`
                                                : 'Image'}
                                        </Text>
                                    </Flex>

                                    {/* Remove button */}
                                    <Tooltip title="Remove attachment">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => onRemove?.(file.id)}
                                            aria-label={`Remove ${fileName}`}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Tooltip>
                                </Flex>
                            </Card>
                        )
                    })}
                </Flex>
            </div>
        </div>
    )
}

export default UploadedFilesPreview
