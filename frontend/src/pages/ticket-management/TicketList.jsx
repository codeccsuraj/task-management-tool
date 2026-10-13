
import React, { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Badge,
    Empty,
    Input,
    Select,
    Skeleton,
    Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    BugOutlined,
    ThunderboltOutlined,
    BookOutlined,
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import { useGetTicketByProjectIdQuery } from '../../features/ticket/api/ticketApi';

const { Text } = Typography;

const STATUS_OPTIONS = [
    { label: 'All statuses', value: '' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'In Review', value: 'in review' },
    { label: 'Done', value: 'done' },
];

const PRIORITY_OPTIONS = [
    { label: 'All priorities', value: '' },
    { label: 'Highest', value: 'highest' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Lowest', value: 'lowest' },
];

const TYPE_CONFIG = {
    bug: {
        label: 'Bug',
        color: '#dc3545',
        icon: <BugOutlined />,
    },
    feature: {
        label: 'Feature',
        color: '#1677ff',
        icon: <ThunderboltOutlined />,
    },
    story: {
        label: 'Story',
        color: '#198754',
        icon: <BookOutlined />,
    },
    task: {
        label: 'Task',
        color: '#7952b3',
        icon: <BookOutlined />,
    },
};

const STATUS_CONFIG = {
    todo: {
        label: 'To Do',
        color: 'default',
    },
    'in progress': {
        label: 'In Progress',
        color: 'processing',
    },
    'in review': {
        label: 'In Review',
        color: 'warning',
    },
    done: {
        label: 'Done',
        color: 'success',
    },
    blocked: {
        label: 'Blocked',
        color: 'error',
    },
};

const PRIORITY_CONFIG = {
    highest: { label: 'Highest', color: '#cf1322' },
    high: { label: 'High', color: '#fa541c' },
    medium: { label: 'Medium', color: '#d48806' },
    low: { label: 'Low', color: '#1677ff' },
    lowest: { label: 'Lowest', color: '#8c8c8c' },
};

const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsedDate);
};

const stripHtml = (html = '') =>
    html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

const TicketList = () => {
    const { project } = useParams();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    // Debounce search requests.
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data: ticketRes,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetTicketByProjectIdQuery(
        {
            page,
            limit,
            projectKey: project,
            ...(search && { search }),
            ...(status && { status }),
            ...(priority && { priority }),
        },
        { skip: !project }
    );

    const tickets = ticketRes?.data?.tickets ?? [];
    const pagination = ticketRes?.data?.pagination;
    const projectInfo = ticketRes?.data?.project;

    const columns = useMemo(
        () => [
            {
                title: 'TICKET',
                key: 'ticket',
                width: 330,
                render: (_, ticket) => {
                    const type =
                        TYPE_CONFIG[ticket.type?.toLowerCase()] ??
                        TYPE_CONFIG.task;

                    const description = stripHtml(ticket.description);

                    return (
                        <div className="d-flex align-items-start gap-3 py-1">
                            <div
                                className="ticket-type-icon flex-shrink-0"
                                style={{
                                    color: type.color,
                                    backgroundColor: `${type.color}12`,
                                }}
                            >
                                {type.icon}
                            </div>

                            <div className="min-w-0">
                                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                    <Text
                                        className="ticket-key"
                                        copyable
                                    >
                                        {ticket.ticketId}
                                    </Text>

                                    <Tooltip title={type.label}>
                                        <Tag
                                            bordered={false}
                                            color={type.color}
                                            className="m-0"
                                        >
                                            {type.label}
                                        </Tag>
                                    </Tooltip>
                                </div>

                                <Text
                                    strong
                                    className="ticket-title d-block"
                                >
                                    {ticket.title}
                                </Text>

                                {description && (
                                    <Text
                                        type="secondary"
                                        className="ticket-description d-block mt-1"
                                    >
                                        {description}
                                    </Text>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                title: 'STATUS',
                dataIndex: 'status',
                key: 'status',
                width: 140,
                render: (value) => {
                    const normalized = value?.toLowerCase();
                    const config =
                        STATUS_CONFIG[normalized] ?? {
                            label: value || 'Unknown',
                            color: 'default',
                        };

                    return (
                        <Tag
                            color={config.color}
                            bordered={false}
                            className="ticket-status-tag"
                        >
                            {config.label}
                        </Tag>
                    );
                },
            },
            {
                title: 'PRIORITY',
                dataIndex: 'priority',
                key: 'priority',
                width: 125,
                render: (value) => {
                    const config =
                        PRIORITY_CONFIG[value?.toLowerCase()] ?? {
                            label: value || 'None',
                            color: '#8c8c8c',
                        };

                    return (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span
                                className="ticket-priority-dot"
                                style={{ backgroundColor: config.color }}
                            />
                            <Text>{config.label}</Text>
                        </span>
                    );
                },
            },
            {
                title: 'ASSIGNEE',
                dataIndex: 'assigned',
                key: 'assigned',
                width: 175,
                render: (assigned) => {
                    const user =
                        assigned && typeof assigned === 'object'
                            ? assigned
                            : null;

                    const name =
                        user?.full_name ||
                        user?.name ||
                        (typeof assigned === 'string'
                            ? `User ${assigned.slice(-6)}`
                            : 'Unassigned');

                    if (!assigned) {
                        return (
                            <span className="d-inline-flex align-items-center gap-2 text-secondary">
                                <Avatar size={28} icon={<UserOutlined />} />
                                <Text type="secondary">Unassigned</Text>
                            </span>
                        );
                    }

                    return (
                        <Tooltip title={user?.email || name}>
                            <span className="d-inline-flex align-items-center gap-2">
                                <Avatar
                                    size={28}
                                    style={{
                                        backgroundColor: '#e6f4ff',
                                        color: '#1677ff',
                                    }}
                                >
                                    {getInitials(name) || <UserOutlined />}
                                </Avatar>
                                <Text className="ticket-assignee-name">
                                    {name}
                                </Text>
                            </span>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'DUE DATE',
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: 145,
                render: (value, ticket) => {
                    const formatted = formatDate(value);

                    if (!formatted) {
                        return <Text type="secondary">—</Text>;
                    }

                    const due = new Date(value);
                    const today = new Date();

                    today.setHours(0, 0, 0, 0);
                    due.setHours(0, 0, 0, 0);

                    const overdue =
                        due < today && ticket.status?.toLowerCase() !== 'done';

                    return (
                        <span
                            className={`d-inline-flex align-items-center gap-2 ${
                                overdue ? 'text-danger' : ''
                            }`}
                        >
                            {overdue ? (
                                <ClockCircleOutlined />
                            ) : (
                                <CalendarOutlined />
                            )}
                            <Text type={overdue ? 'danger' : undefined}>
                                {formatted}
                            </Text>
                        </span>
                    );
                },
            },
        ],
        []
    );

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    const handlePriorityChange = (value) => {
        setPriority(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearch('');
        setStatus('');
        setPriority('');
        setPage(1);
    };

    if (!project) {
        return (
            <Empty
                className="py-5"
                description="Select a project to view tickets"
            />
        );
    }

    if (isLoading) {
        return (
            <div className="ticket-list-loading p-4">
                <Skeleton active paragraph={{ rows: 5 }} />
            </div>
        );
    }

    if (isError || ticketRes?.success === false) {
        return (
            <div className="ticket-list-error text-center py-5">
                <p className="text-danger mb-3">
                    Unable to load tickets. Please try again.
                </p>
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => refetch()}
                >
                    <ReloadOutlined className="me-2" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="ticket-list-page">
            {/* Project summary */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="ticket-project-key">
                            {projectInfo?.key || project.toUpperCase()}
                        </span>

                        <span className="text-secondary">/</span>

                        <Text strong className="ticket-project-name">
                            {projectInfo?.name || 'Project tickets'}
                        </Text>
                    </div>

                    <Text type="secondary">
                        Browse, search and track your project tickets.
                    </Text>
                </div>

                <div className="ticket-total-summary">
                    <Text type="secondary" className="small d-block">
                        Total tickets
                    </Text>
                    <span className="ticket-total-count">
                        {pagination?.total ?? tickets.length}
                    </span>
                </div>
            </div>

            {/* Search and filters */}
            <div className="ticket-toolbar d-flex flex-wrap align-items-center gap-2 mb-3">
                <Input
                    allowClear
                    prefix={<SearchOutlined className="text-secondary" />}
                    placeholder="Search ticket ID or title..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="ticket-search"
                />

                <Select
                    value={status}
                    onChange={handleStatusChange}
                    options={STATUS_OPTIONS}
                    className="ticket-filter"
                    aria-label="Filter by status"
                />

                <Select
                    value={priority}
                    onChange={handlePriorityChange}
                    options={PRIORITY_OPTIONS}
                    className="ticket-filter"
                    aria-label="Filter by priority"
                />

                <button
                    type="button"
                    className="btn btn-light border ticket-reset-btn"
                    onClick={clearFilters}
                >
                    Clear filters
                </button>

                <Tooltip title="Refresh tickets">
                    <button
                        type="button"
                        className="btn btn-light border ticket-refresh-btn ms-sm-auto"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        aria-label="Refresh tickets"
                    >
                        <ReloadOutlined spin={isFetching} />
                    </button>
                </Tooltip>
            </div>

            {/* Tickets table */}
            <div className="ticket-table-card">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={tickets}
                    loading={isFetching}
                    scroll={{ x: 950 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    search || status || priority
                                        ? 'No tickets match your filters'
                                        : 'No tickets in this project yet'
                                }
                            />
                        ),
                    }}
                    pagination={{
                        current: pagination?.page ?? page,
                        pageSize: pagination?.limit ?? limit,
                        total: pagination?.total ?? tickets.length,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) =>
                            `${range[0]}–${range[1]} of ${total} tickets`,
                        onChange: (nextPage, nextLimit) => {
                            setPage(nextPage);
                            setLimit(nextLimit);
                        },
                        size: 'default',
                    }}
                />
            </div>

            <div className="ticket-list-footer d-flex flex-wrap justify-content-between gap-2 mt-3">
                <Text type="secondary" className="small">
                    Showing {tickets.length} tickets on this page
                </Text>

                <Text type="secondary" className="small">
                    Updated from your project ticket data
                </Text>
            </div>
        </div>
    );
};

export default TicketList;
