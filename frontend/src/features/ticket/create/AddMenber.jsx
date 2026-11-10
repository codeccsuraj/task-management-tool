import React, { useMemo, useState } from 'react';
import {
    Drawer,
    Form,
    Select,
    Avatar,
    Tag,
    Empty,
    Typography,
    Divider,
    message
} from 'antd';
import { UserAddOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

import ButtonInput from '../../../components/form/ButtonInput';
import { useGetUsersQuery } from '../../user/api/userApi';
import { useUpdateMemberProjectMutation } from '../api/ticketApi';

const { Text } = Typography;

const AddMenber = ({ isOpen, onClose, prevData = {} }) => {
    const [form] = Form.useForm();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [updateMemberProject] = useUpdateMemberProjectMutation()
    const { data: memberRes, } = useGetUsersQuery({ page: 1, limit: 10, });
    // Get existing project member IDs
    const existingMemberIds = useMemo(() => prevData?.members?.map(item => item.user?._id).filter(Boolean), [prevData]);

    const userOptions = memberRes?.data?.users;

    // Available members excluding existing members
    const availableUsers = useMemo(
        () => userOptions
            ?.filter(item => !existingMemberIds?.includes(item?.authId?._id))
            ?.map(item => ({
                value: item.authId?._id,
                label: item.full_name || item.authId?.email,
                email: item.authId?.email
            })),
        [userOptions, existingMemberIds]
    );
    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const result = await updateMemberProject({
                id: prevData?._id,
                data: values?.members
            }).unwrap()
            if (!result?.success) {
                message.warning(result?.message || "")
            }
            form.resetFields();
            setSelectedUsers([]);
            onClose();
        } catch (error) {
            message.error(error?.data?.message || "");
            console.error("Create project error:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleClose = () => {
        form.resetFields();
        setSelectedUsers([]);
        onClose();
    };

    return (
        <Drawer
            title={
                <div className="d-flex align-items-center gap-2">
                    <Avatar
                        shape="square"
                        icon={<UserAddOutlined />}
                        style={{ background: '#e6f4ff', color: '#1677ff' }}
                    />
                    <div>
                        <div className="fw-semibold">Add project members</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Invite people to collaborate on this project
                        </Text>
                    </div>
                </div>
            }
            open={isOpen}
            onClose={handleClose}
            size={550}
            destroyOnHidden
            footer={
                <div className="d-flex justify-content-end gap-3 py-1">
                    <ButtonInput
                        type="button"
                        label="Cancel"
                        className="btn-base btn-outline"
                        disabled={loading}
                        onClick={handleClose}
                    />

                    <ButtonInput
                        type="submit"
                        variant="success"
                        label="Add Members"
                        className="btn-base btn-submit"
                        loading={loading}
                        onClick={() => form.submit()}
                    />
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="members"
                    label="Select members"
                    rules={[
                        {
                            required: true,
                            message: 'Please select at least one member'
                        }
                    ]}
                >
                    <Select
                        mode="multiple"
                        size="large"
                        placeholder="Search by name or email..."
                        showSearch={{
                            optionFilterProp: 'label',
                            filterOption: true,
                        }}
                        allowClear
                        options={availableUsers}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        notFoundContent={
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No members available"
                            />
                        }
                        optionRender={(option) => (
                            <div className="d-flex align-items-center gap-2 py-1">
                                <Avatar
                                    size={34}
                                    icon={<UserOutlined />}
                                    style={{
                                        background: '#f0f5ff',
                                        color: '#1677ff'
                                    }}
                                />

                                <div className="d-flex flex-column">
                                    <span className="fw-medium">
                                        {option.data.label}
                                    </span>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        {option.data.email}
                                    </Text>
                                </div>
                            </div>
                        )}
                        tagRender={(props) => {
                            const user = availableUsers.find(
                                item => item.value === props.value
                            );

                            return (
                                <Tag
                                    closable={props.closable}
                                    onClose={props.onClose}
                                    className="m-1 py-1 px-2"
                                >
                                    {user?.label || props.label}
                                </Tag>
                            );
                        }}
                    />
                </Form.Item>

                <Divider />

                <div className="d-flex align-items-center justify-content-between mb-3">
                    <Text strong>Selected members</Text>
                    <Tag color="blue">
                        {selectedUsers.length} selected
                    </Tag>
                </div>

                {selectedUsers?.length > 0 ? (
                    <div className="d-flex flex-column gap-3 mb-3">
                        {selectedUsers.map(id => {
                            const user = availableUsers.find(
                                item => item.value === id
                            );

                            if (!user) return null;

                            return (
                                <div
                                    key={id}
                                    className="d-flex align-items-center gap-3"
                                >
                                    <Avatar icon={<UserOutlined />} />

                                    <div className="d-flex flex-column">
                                        <span className="fw-medium">
                                            {user.label}
                                        </span>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            <MailOutlined className="me-1" />
                                            {user.email}
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No members selected yet"
                    />
                )}

                {/* Existing Project Members */}
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h6 className="fw-semibold mb-1">Project Members</h6>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                People already added to this project
                            </Text>
                        </div>

                        <Tag color="success">
                            {prevData?.members?.length} Members
                        </Tag>
                    </div>

                    {prevData?.members?.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {prevData?.members?.map((item) => {
                                const user = item.user;
                                const fullName = user?.user?.full_name || 'Unknown User';

                                return (
                                    <div
                                        key={item._id}
                                        className="d-flex align-items-center justify-content-between p-2 rounded border"
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <Avatar
                                                icon={<UserOutlined />}
                                                style={{
                                                    background: '#e6f4ff',
                                                    color: '#1677ff'
                                                }}
                                            />

                                            <div>
                                                <div className="fw-semibold">
                                                    {fullName}
                                                </div>

                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {user?.email}
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <Tag color="blue">
                                                {item.role}
                                            </Tag>

                                            <Tag color={item.status === 'active' ? 'success' : 'warning'}>
                                                {item.status}
                                            </Tag>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No members added yet"
                        />
                    )}
                </div>

                <Divider />
            </Form>
        </Drawer>
    );
};

export default AddMenber;