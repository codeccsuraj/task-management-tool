import React, { useEffect, useMemo, useState } from 'react';
import { Button, Empty, Input, Result, Select, Skeleton, Table, Tooltip, Typography } from 'antd';
import { ClearOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import { useGetTicketByProjectIdQuery } from '../../features/ticket/api/ticketApi';
import { ticketPriorityOptions, ticketStatusOptions } from '../../features/ticket/helper/ticketVar';
import { getTicketListColumns } from './helper/ticketColumns';

const { Title, Text } = Typography;

const SEARCH_DEBOUNCE_MS = 400;

// Turn "{label, icon, value}" options into options with an icon + text label
const withIcons = (options = []) =>
    options.map((item) => ({
        value: item.value,
        label: (
            <div className="d-flex align-items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
            </div>
        ),
    }));

const TicketList = () => {
    const { project } = useParams();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState();
    const [priority, setPriority] = useState();

    // Debounce the search box so we don't fire a request on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Switching project starts from a clean slate
    useEffect(() => {
        setPage(1);
        setSearchInput('');
        setSearch('');
        setStatus(undefined);
        setPriority(undefined);
    }, [project]);

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
    const total = pagination?.total ?? tickets.length;

    const columns = useMemo(() => getTicketListColumns(), []);
    const statusOptions = useMemo(() => withIcons(ticketStatusOptions), []);
    const priorityOptions = useMemo(() => withIcons(ticketPriorityOptions), []);

    const hasFilters = Boolean(search || status || priority || searchInput);

    const clearFilters = () => {
        setSearchInput('');
        setSearch('');
        setStatus(undefined);
        setPriority(undefined);
        setPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    const handlePriorityChange = (value) => {
        setPriority(value);
        setPage(1);
    };

    /* ------------------------------ states ------------------------------ */

    if (!project) {
        return <Empty className="py-5" description="Select a project to view its tickets" />;
    }

    if (isLoading) {
        return (
            <div className="bg-white border rounded-3 p-4">
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    const failed = isError || ticketRes?.success === false;

    /* ------------------------------ render ------------------------------ */

    return (
        <div className="ticket-list-page">
            {/* Page header */}

            <div className="bg-white border rounded-3">
                {/* Toolbar */}
                <div className="d-flex flex-wrap align-items-center gap-2 p-3 border-bottom">
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isFetching}>
                            {""}
                        </Button>
                    </Tooltip>
                    <Input
                        allowClear
                        prefix={<SearchOutlined className="text-muted" />}
                        placeholder="Search by title or ticket key"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ width: 280, maxWidth: '100%' }}
                    />

                    <Select
                        allowClear
                        placeholder="Status"
                        value={status}
                        options={statusOptions}
                        onChange={handleStatusChange}
                        style={{ width: 170 }}
                    />

                    <Select
                        allowClear
                        placeholder="Priority"
                        value={priority}
                        options={priorityOptions}
                        onChange={handlePriorityChange}
                        style={{ width: 170 }}
                    />

                    {hasFilters && (
                        <Button type="link" icon={<ClearOutlined />} onClick={clearFilters}>
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* Table or error */}
                {failed ? (
                    <Result
                        status="warning"
                        title="Unable to load tickets"
                        subTitle="Check your connection and try again."
                        extra={
                            <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
                                Try again
                            </Button>
                        }
                    />
                ) : (
                    <div className='p-3'>
                        <Table
                            rowKey="_id"
                            columns={columns}
                            dataSource={tickets}
                            loading={isFetching}
                            scroll={{ x: 950 }}
                            className="ticket-table"
                            size='small'
                            locale={{
                                emptyText: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            hasFilters
                                                ? 'No tickets match your filters'
                                                : 'No tickets in this project yet'
                                        }
                                    >
                                        {hasFilters && (
                                            <Button onClick={clearFilters}>Clear filters</Button>
                                        )}
                                    </Empty>
                                ),
                            }}
                            pagination={{
                                current: pagination?.page ?? page,
                                pageSize: pagination?.limit ?? limit,
                                total,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (count, range) => `${range[0]}–${range[1]} of ${count} tickets`,
                                hideOnSinglePage: total <= 10,
                                className: 'px-3',
                                onChange: (nextPage, nextLimit) => {
                                    // Changing page size sends the user back to page 1
                                    setPage(nextLimit !== limit ? 1 : nextPage);
                                    setLimit(nextLimit);
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketList;