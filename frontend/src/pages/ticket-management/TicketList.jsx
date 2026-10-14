
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
import { getTicketListColumns } from './helper/ticketColumns';

const { Text } = Typography;

const TicketList = () => {
    const { project } = useParams();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

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

    const columns = getTicketListColumns()

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
            {/* Tickets table */}
            <div className="p-4 bg-white rounded-3">
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
