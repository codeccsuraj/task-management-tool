import React, { useState } from "react";
import { Avatar, Button, Pagination, Spin, Tag, Tooltip } from "antd";
import { EyeOutlined, MessageOutlined } from "@ant-design/icons";

import Heading from "../../components/custom/Heading";
import CreateUser from "../../features/user/create/CreateUser";
import { useGetUsersQuery } from "../../features/user/api/userApi";
import ButtonInput from "../../components/form/ButtonInput";
import UpdateTeam from "../../features/user/update/UpdateTeam";

const UserList = () => {
    const [showForm, setShowForm] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [selectedUser, setSelectedUser] = useState(null)
    const { data, isLoading, isFetching, } = useGetUsersQuery({
        page: pagination.current,
        limit: pagination.pageSize,
    });

    const users = data?.data?.users || [];
    const paginationData = data?.data?.pagination;

    const totalRecords = paginationData?.totalRecords || 0;

    const handlePageChange = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize,
        });
    };

    const getUserName = (user) => {
        return (
            user?.full_name ||
            user?.name ||
            user?.authId?.full_name ||
            "Unnamed User"
        );
    };

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const getRole = (user) => {
        return (
            user?.role ||
            user?.authId?.role ||
            "Team Member"
        );
    };

    const handleViewProfile = (item) => {
        setSelectedUser(item)
        setShowUpdate(true)
    }

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <Heading
                    title="Team"
                    subtitle="Manage your team members"
                />

                <ButtonInput
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="btn-submit"
                    label="Add new"
                />
            </div>

            {/* User List */}
            <div className="card">
                <div className="card-body">
                    {isLoading ? (
                        <div className="team-loading">
                            <Spin />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="team-empty">
                            <div className="team-empty-title">
                                No team members found
                            </div>

                            <div className="team-empty-text">
                                Add a new team member to get started.
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white border rounded-lg mb-3 px-3">

                                {users.map((user) => {
                                    const name = getUserName(user);

                                    return (
                                        <div
                                            className="d-flex align-items-center justify-content-between py-3 border-bottom"
                                            key={user?._id}
                                        >
                                            {/* Left section */}
                                            <div className="d-flex align-items-center flex-grow-1">

                                                <Avatar className="team-avatar">
                                                    {getInitials(name)}
                                                </Avatar>

                                                <div className="ms-3">
                                                    <div className="fw-semibold text-dark">
                                                        {name} - {user?.authId?.email}
                                                    </div>

                                                    <div className="text-muted small">
                                                        {getRole(user)}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Right section */}
                                            <div className="d-flex align-items-center gap-2">
                                                <Tooltip title="View Profile" placement="top">
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        className="action-icon-btn"
                                                        onClick={() => handleViewProfile(user)}
                                                    />
                                                </Tooltip>

                                                <Tag className="ticket-tag mb-0">
                                                    {user?.openTickets || 0} tickets open
                                                </Tag>

                                                <Button
                                                    size="small"
                                                    icon={<MessageOutlined />}
                                                    className="message-btn"
                                                >
                                                    Message
                                                </Button>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>

                            {/* Pagination */}
                            <div className="team-pagination">

                                <div className="pagination-info">
                                    Showing{" "}
                                    <strong>
                                        {Math.min(
                                            (pagination.current - 1) *
                                            pagination.pageSize +
                                            1,
                                            totalRecords
                                        )}
                                    </strong>{" "}
                                    -
                                    <strong>
                                        {Math.min(
                                            pagination.current *
                                            pagination.pageSize,
                                            totalRecords
                                        )}
                                    </strong>{" "}
                                    of{" "}
                                    <strong>{totalRecords}</strong>
                                </div>

                                <div className="d-flex justify-content-end align-items-center mt-3 pt-3">
                                    <Pagination
                                        current={pagination.current}
                                        pageSize={pagination.pageSize}
                                        total={totalRecords}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        size="small"
                                        disabled={isFetching}
                                        className="custom-pagination"
                                    />
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Create User */}
            <CreateUser
                isOpen={showForm}
                onClose={() => setShowForm(false)}
            />
            <UpdateTeam
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                prevData={selectedUser}
            />

        </div>
    );
};

export default UserList;