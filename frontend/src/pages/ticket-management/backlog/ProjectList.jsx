import React, { useState } from 'react'
import Heading from '../../../components/custom/Heading'
import ButtonInput from '../../../components/form/ButtonInput'
import { useSelector } from 'react-redux';
import AddProject from '../../../features/ticket/create/AddProject';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useGetMyProjectsQuery } from '../../../features/ticket/api/ticketApi';
import { Empty, Skeleton, Table } from 'antd';
import { getProjectListColumns } from '../helper/ticketColumns';
const ProjectList = () => {
    const authUser = useSelector((state) => state?.auth?.user);
    const [showAddForm, setShowAddForm] = useState(false);
    const authId = authUser?.id;
    const isAdmin = authUser?.user_group === "ADMIN";

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10)

    const { data: projectRes, isLoading: projectLoading, isFetching: projectFetching,
    } = useGetMyProjectsQuery({
        page,
        limit,
    });

    const rowsData = projectRes?.data?.projects ?? [];
    const pagination = projectRes?.data?.pagination;
    const total = pagination?.total ?? rowsData.length;

    const tableColumns = getProjectListColumns()
    console.log("projectRes", projectRes)

    if (projectLoading) {
        return (
            <div className="bg-white border rounded-3 p-4">
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Heading
                    title="Active Projects"
                    subtitle="Manage your projects"
                />

                <ButtonInput
                    type="button"
                    variant='default'
                    label="Add Project"
                    icon={<PlusCircleOutlined />}
                    onClick={() => setShowAddForm(true)}
                />
            </div>

            <div className='p-3 bg-white rounded-2'>
                <Table
                    rowKey="_id"
                    columns={tableColumns}
                    dataSource={rowsData}
                    loading={projectFetching}
                    scroll={{ x: 950 }}
                    className="ticket-table"
                    size='small'
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No tickets match your filters"
                            >
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

            <AddProject isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
        </div>
    )
}

export default ProjectList
