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
    description_changed: {
        label: 'Description updated',
        color: 'cyan',
        icon: <EditOutlined />,
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

const getActorName = (actor) => {
    if (!actor || typeof actor !== 'object') {
        return 'Team member';
    }

    return (
        actor.user?.full_name ||
        actor.email ||
        'Team member'
    );
};

const getHistoryDescription = (item) => {
    if (item.eventType === 'ticket_created') {
        return (
            <div>
                Created ticket
                {item.metadata?.ticketId && (
                    <Text strong className="ms-1">
                        {item.metadata.ticketId}
                    </Text>
                )}

                {item.newValue?.title && (
                    <div className="mt-1 text-secondary">
                        {item.newValue.title}
                    </div>
                )}
            </div>
        );
    }

    if (item.eventType === 'description_changed') {
        return (
            <Text type="secondary">
                {item.message || 'Updated ticket description'}
            </Text>
        );
    }

    if (
        item.field &&
        item.oldValue !== undefined &&
        item.newValue !== undefined
    ) {
        return (
            <div className="d-flex flex-wrap align-items-center gap-2">
                <Tag className="history-value">
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

const TicketHistory = ({ ticketId, maxHeight = 480 }) => {
    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetHistoryByTicketIdQuery(ticketId, {
        skip: !ticketId,
    });

    const history = useMemo(() => {
        const records = Array.isArray(response)
            ? response
            : response?.data;

        if (!Array.isArray(records)) return [];

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
        <div className="ticket-history-container">

            {/* Sticky header */}
            <div className="ticket-history-header">
                <div className="d-flex align-items-center gap-3">
                    <div className="history-header-icon">
                        <HistoryOutlined />
                    </div>

                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <Text strong className="fs-6">
                                Activity
                            </Text>

                            <Tag color="blue" className="rounded-pill m-0">
                                {history.length}
                            </Tag>
                        </div>

                        <Text type="secondary" className="small">
                            Track all changes and updates
                        </Text>
                    </div>
                </div>

                {isFetching && (
                    <div className="history-fetching">
                        <span className="history-pulse" />
                        <Text type="secondary" className="small">
                            Syncing
                        </Text>
                    </div>
                )}
            </div>

            {/* Scrollable content */}
            <div
                className="ticket-history-scroll"
                style={{ maxHeight }}
            >
                {history.length === 0 ? (
                    <div className="history-empty">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Text type="secondary">
                                    No activity recorded yet
                                </Text>
                            }
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
                                    <div className={`history-dot history-dot-${config.color}`}>
                                        {config.icon}
                                    </div>
                                ),
                                children: (
                                    <div className="ticket-history-card">

                                        <div className="history-card-header">
                                            <div className="d-flex flex-wrap align-items-center gap-2">
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
                                                title={formatDate(item.createdAt)}
                                            >
                                                <Text
                                                    type="secondary"
                                                    className="history-time"
                                                >
                                                    <ClockCircleOutlined />
                                                    {formatDate(item.createdAt)}
                                                </Text>
                                            </Tooltip>
                                        </div>

                                        <div className="history-card-content">
                                            {getHistoryDescription(item)}
                                        </div>

                                        <div className="history-card-footer">
                                            <Avatar
                                                size={23}
                                                className="history-actor-avatar"
                                            >
                                                {getActorName(item.actor)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </Avatar>

                                            <Text
                                                type="secondary"
                                                className="small"
                                            >
                                                {getActorName(item.actor)}
                                            </Text>
                                        </div>
                                    </div>
                                ),
                            };
                        })}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketHistory;