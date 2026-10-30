import React, { useMemo } from 'react';
import {
    Avatar,
    Empty,
    Skeleton,
    Tag,
    Timeline,
    Tooltip,
    Typography,
    Alert,
} from 'antd';

import {
    HistoryOutlined,
    PlusCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useGetHistoryByTicketIdQuery } from '../../../features/ticket/api/ticketApi';

const { Text } = Typography;

const EVENT_CONFIG = {
    ticket_created: {
        label: 'Ticket created',
        color: 'green',
        icon: <PlusCircleOutlined />,
    },
    status_changed: {
        label: 'Status changed',
        color: 'blue',
        icon: <SyncOutlined />,
    },
    priority_changed: {
        label: 'Priority changed',
        color: 'orange',
        icon: <ExclamationCircleOutlined />,
    },
    assignee_changed: {
        label: 'Assignee changed',
        color: 'purple',
        icon: <CheckCircleOutlined />,
    },
    default: {
        label: 'Ticket updated',
        color: 'default',
        icon: <EditOutlined />,
    },
};

const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'None';
    }

    if (typeof value === 'object') {
        return Object.entries(value)
            .map(([key, val]) => `${formatLabel(key)}: ${formatValue(val)}`)
            .join(', ');
    }

    return String(value);
};

const formatLabel = (value = '') => {
    return String(value)
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
        return 'Unknown date';
    }

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(date));
};

const getEventConfig = (eventType) => {
    return EVENT_CONFIG[eventType] || EVENT_CONFIG.default;
};

const getHistoryDescription = (item) => {
    if (item.eventType === 'ticket_created') {
        const title = item.newValue?.title;

        return (
            <div>
                Created ticket
                {item.metadata?.ticketId && (
                    <Text strong className="ms-1">
                        {item.metadata.ticketId}
                    </Text>
                )}
                {title && (
                    <div className="mt-1 text-secondary">
                        {title}
                    </div>
                )}
            </div>
        );
    }

    if (item.field && item.oldValue !== undefined && item.newValue !== undefined) {
        return (
            <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                <Text type="secondary">
                    {formatLabel(item.field)}
                </Text>

                <Tag className="m-0">
                    {formatValue(item.oldValue)}
                </Tag>

                <span className="text-secondary">→</span>

                <Tag color={getEventConfig(item.eventType).color}>
                    {formatValue(item.newValue)}
                </Tag>
            </div>
        );
    }

    return (
        <Text type="secondary">
            {item.message || 'Ticket details updated'}
        </Text>
    );
};

const TicketHistory = ({ ticketId }) => {
    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetHistoryByTicketIdQuery(ticketId, {
        skip: !ticketId,
    });

    // Supports both { data: [...] } and a direct array response.
    const history = useMemo(() => {
        const records = Array.isArray(response)
            ? response
            : response?.data;

        if (!Array.isArray(records)) {
            return [];
        }

        return [...records].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [response]);

    if (!ticketId) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Ticket not selected"
                description="Select a ticket to view its history."
            />
        );
    }

    if (isLoading) {
        return (
            <div className="p-3">
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                type="error"
                showIcon
                message="Unable to load ticket history"
                description={
                    error?.data?.message ||
                    'Something went wrong while fetching ticket history.'
                }
            />
        );
    }

    return (
        <div className="ticket-history bg-light p-2">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <HistoryOutlined className="text-secondary fs-5" />
                        <Text strong className="fs-6">
                            Activity history
                        </Text>
                        <Tag className="rounded-pill">
                            {history.length}
                        </Tag>
                    </div>

                    <Text type="secondary" className="small">
                        Track changes and activity on this ticket
                    </Text>
                </div>

                {isFetching && (
                    <Text type="secondary" className="small">
                        Updating...
                    </Text>
                )}
            </div>

            {/* Timeline */}
            {history.length === 0 ? (
                <div className="py-5">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No activity recorded yet"
                    />
                </div>
            ) : (
                <Timeline
                    className="ticket-history-timeline"
                    items={history.map((item) => {
                        const config = getEventConfig(item.eventType);

                        return {
                            key: item._id,
                            color: config.color,
                            dot: (
                                <Avatar
                                    size={30}
                                    icon={config.icon}
                                    className="ticket-history-icon"
                                />
                            ),
                            children: (
                                <div className="ticket-history-card">
                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <Text strong>
                                                {config.label}
                                            </Text>

                                            {item.field && (
                                                <Tag className="m-0">
                                                    {formatLabel(item.field)}
                                                </Tag>
                                            )}
                                        </div>

                                        <Tooltip
                                            title={new Date(item.createdAt).toLocaleString()}
                                        >
                                            <Text
                                                type="secondary"
                                                className="small text-nowrap"
                                            >
                                                <ClockCircleOutlined className="me-1" />
                                                {formatDate(item.createdAt)}
                                            </Text>
                                        </Tooltip>
                                    </div>

                                    <div className="mt-2">
                                        {getHistoryDescription(item)}
                                    </div>

                                    {item.actor && (
                                        <div className="mt-3">
                                            <Text
                                                type="secondary"
                                                className="small"
                                            >
                                                <span className="me-1">
                                                    By
                                                </span>
                                                <Text type="secondary">
                                                    {typeof item.actor === 'object'
                                                        ? item?.actor?.user?.full_name ||
                                                          item.actor.email ||
                                                          'Team member'
                                                        : 'Team member'}
                                                </Text>
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            ),
                        };
                    })}
                />
            )}
        </div>
    );
};

export default TicketHistory;