import React, { useState } from 'react'
import Heading from '../../../components/custom/Heading'
import ButtonInput from '../../../components/form/ButtonInput'
import { useSelector } from 'react-redux';
import AddProject from '../../../features/ticket/create/AddProject';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useGetMyProjectsQuery } from '../../../features/ticket/api/ticketApi';
import { Empty, Skeleton, Table } from 'antd';
import { getProjectListColumns } from '../helper/ticketColumns';
import UpdateProject from '../../../features/ticket/update/UpdateProject';
import AddMenber from '../../../features/ticket/create/AddMenber';
const ProjectList = () => {
    const authUser = useSelector((state) => state?.auth?.user);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [addedMember, setAddedMember] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const authId = authUser?.id;
    const isAdmin = authUser?.user_group === "ADMIN";

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10)

    const { data: projectRes, isLoading: projectLoading, isFetching: projectFetching,
    } = useGetMyProjectsQuery({ page, limit, });

    const rowsData = projectRes?.data?.projects ?? [];
    const pagination = projectRes?.data?.pagination;
    const total = pagination?.total ?? rowsData.length;
    const handleProjectUpdateForm = (val) => {
        setSelectedProject(val);
        setShowUpdateForm(true)
    }

    const handleAddMember = (val) => {
        setAddedMember(val)
        setShowAddMember(true)
    }

    const tableColumns = getProjectListColumns(handleProjectUpdateForm, handleAddMember)

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

                <div className='d-flex align-items-center gap-2'>
                    <ButtonInput
                        type="button"
                        variant='default'
                        label="Add Project"
                        icon={<PlusCircleOutlined />}
                        onClick={() => setShowAddForm(true)}
                    />
                </div>
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
            <UpdateProject isOpen={showUpdateForm} onClose={() => setShowUpdateForm(false)} prevData={selectedProject} />
            <AddMenber isOpen={showAddMember} onClose={() => setShowAddMember(false)} prevData={addedMember} />
        </div>
    )
}

export default ProjectList
