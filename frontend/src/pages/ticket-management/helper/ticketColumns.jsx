
import React from 'react';
import { Link } from "react-router-dom"
import { Avatar, Tag, Tooltip, Typography } from 'antd';

import {
    ticketPriorityOptions,
    ticketStatusOptions,
    ticketTypeOptions,
} from '../../../features/ticket/helper/ticketVar';

const { Text } = Typography;

/* ----------------------------- helpers ----------------------------- */

// Find the option (label + icon) that matches a stored value, ignoring case
const findOption = (options = [], value) => {
    const key = String(value ?? '').toLowerCase();
    return options.find((item) => String(item.value).toLowerCase() === key);
};

// Fallback when the value has no matching option: "in_progress" -> "In progress"
const humanize = (value) => {
    const text = String(value ?? '').replace(/[_-]+/g, ' ').trim().toLowerCase();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
};

// Pick an antd Tag colour from the wording of the value
const statusColor = (value) => {
    const v = String(value ?? '').toLowerCase();
    if (/(done|complete|closed|resolved|deployed)/.test(v)) return 'success';
    if (/(progress|doing|develop)/.test(v)) return 'processing';
    if (/(review|test|qa|verify)/.test(v)) return 'warning';
    if (/(block|reject|cancel)/.test(v)) return 'error';
    return 'default';
};

const priorityColor = (value) => {
    const v = String(value ?? '').toLowerCase();
    if (/(critical|highest|urgent|blocker)/.test(v)) return 'red';
    if (/high/.test(v)) return 'volcano';
    if (/(medium|normal)/.test(v)) return 'gold';
    if (/(low|lowest|minor)/.test(v)) return 'green';
    return 'default';
};

const getInitials = (name = '') =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

const Empty = () => <Text type="secondary">—</Text>;

/* ------------------------------ columns ------------------------------ */

export const getTicketListColumns = () => [
    {
        title: 'Ticket',
        dataIndex: 'ticketId',
        key: 'ticketId',
        width: 120,
        render: (val) =>
            val ? (
                <Link to={`/ticket/${val}`} className="link fw-semibold text-nowrap">
                    {val}
                </Link>
            ) : (
                <Empty />
            ),
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 320,
        ellipsis: { showTitle: false },
        render: (val, record) =>
            val ? (
                <Tooltip placement="topLeft" title={val}>
                    <Link to={`/ticket/${record?.ticketId}`} className="link">
                        {val}
                    </Link>
                </Tooltip>
            ) : (
                <Empty />
            ),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (val) => {
            if (!val) return <Empty />;
            const option = findOption(ticketTypeOptions, val);
            return (
                <span className="d-inline-flex align-items-center gap-2 text-nowrap">
                    {option?.icon}
                    <span>{option?.label ?? humanize(val)}</span>
                </span>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (val) => {
            if (!val) return <Empty />;
            const option = findOption(ticketStatusOptions, val);
            return (
                <Tag color={statusColor(val)} className="m-0 fw-medium">
                    {option?.label ?? humanize(val)}
                </Tag>
            );
        },
    },
    {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 140,
        render: (val) => {
            if (!val) return <Empty />;
            const option = findOption(ticketPriorityOptions, val);
            return (
                <span className="d-inline-flex align-items-center gap-2 text-nowrap">
                    {option?.icon}
                    <Tag color={priorityColor(val)} className="m-0">
                        {option?.label ?? humanize(val)}
                    </Tag>
                </span>
            );
        },
    },
    {
        title: 'Assignee',
        dataIndex: ['assigned', 'user', 'full_name'],
        key: 'assigned',
        width: 200,
        render: (name) => {
            const fullName = name?.trim();
            if (!fullName) return <Text type="secondary">Unassigned</Text>;
            return (
                <span className="d-inline-flex align-items-center gap-2">
                    <Avatar
                        size={24}
                        style={{
                            backgroundColor: '#e6f4ff',
                            color: '#1677ff',
                            fontSize: 12,
                            fontWeight: 600,
                            flexShrink: 0,
                        }}
                    >
                        {getInitials(fullName)}
                    </Avatar>
                    <span className="text-capitalize text-truncate">{fullName}</span>
                </span>
            );
        },
    },
];