import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill-new';
import { Upload, Button, message, Modal, Avatar } from 'antd';
import { PaperClipOutlined, UserOutlined } from '@ant-design/icons';

import TextInput from '../../../components/form/TextInput';
import FieldWrapper from '../../FieldWrapper';
import SelectInput from '../../../components/form/SelectInput';
import { ticketPriorityOptions, ticketTypeOptions } from '../helper/ticketVar';
import DateInput from '../../../components/form/DateInput';
import { useGetUsersQuery } from '../../user/api/userApi';
import { useSelector } from 'react-redux';
import { useCreateTicketMutation, useGetSprintByProjectIdQuery } from '../api/ticketApi';
import { useParams } from 'react-router-dom';
import { ticketValidationSchema } from '../helper/validationSchema';

const AddTicket = ({
    open = false,
    onClose,
}) => {
    const { project } = useParams();
    const currentUser = useSelector((state) => state.auth.user);
    const [createTicket] = useCreateTicketMutation()
    const { data, isLoading: isUsersLoading, } = useGetUsersQuery({ page: 1, limit: 10, });
    const { data: sprintRes, } = useGetSprintByProjectIdQuery(project, {
        skip: !project
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            type: null,
            status: null,
            priority: null,
            startDate: null,
            dueDate: null,
            sprint: null,
            assignee: currentUser?.id || currentUser?._id || null,
            attachments: [],
        },

        validationSchema: ticketValidationSchema,

        validateOnBlur: true,
        validateOnChange: false,

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const payload = {
                    title: values.title.trim(),
                    description: values.description || '',
                    type: values.type,
                    status: values.status || 'todo',
                    priority: values.priority,
                    project,
                    sprint: values.sprint,
                    assigned: values.assignee,
                    startDate: values.startDate,
                    dueDate: values.dueDate,
                };

                const response = await createTicket(payload).unwrap();

                console.log("This is res", response)
                message.success(
                    response?.message ||
                    "Team member created successfully"
                );

                resetForm();
                onClose?.();
            } catch (error) {
                console.error('❌ Create ticket error:', error);
                message.error('Unable to prepare ticket');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const userOptions = data?.data?.users || []
    const sprintOptions = sprintRes?.data || []

    return (
        <Modal
            title={
                <div className="d-flex flex-column gap-1">
                    <span className="h6 m-0 p-0">
                        Create Ticket
                    </span>
                    <span className="small text-secondary">
                        Add details to create a new ticket.
                    </span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={<div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formik.isSubmitting}
                    onClick={formik.handleSubmit}
                >
                    {formik.isSubmitting
                        ? 'Creating...'
                        : 'Create Ticket'}
                </button>
            </div>}
            width={1120}
            mask={{
                closable: false
            }}
            centered
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 150px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                },
            }}
        >
            <form>
                <div className="row">
                    {/* Left Section */}
                    <div
                        className="col-8 hide-scrollbar"
                        style={{
                            maxHeight: 'calc(90vh - 150px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        {/* Summary */}
                        <FieldWrapper
                            formik={formik}
                            name="title"
                            label="SUMMARY"
                            className='p-2'
                            required
                        >
                            <TextInput
                                type="text"
                                name="title"
                                id="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Summary"
                                className="mb-2"
                            />
                        </FieldWrapper>

                        {/* Description */}
                        <FieldWrapper
                            formik={formik}
                            name="description"
                            label="DESCRIPTION"
                            className="mb-3"
                        >
                            <div className="description-editor">
                                <ReactQuill
                                    theme="snow"
                                    value={formik.values.description}
                                    onChange={(value) =>
                                        formik.setFieldValue('description', value)
                                    }
                                    onBlur={() =>
                                        formik.setFieldTouched('description', true)
                                    }
                                />
                            </div>
                        </FieldWrapper>

                        {/* Attachments */}
                        <FieldWrapper
                            formik={formik}
                            name="attachments"
                            label="ATTACHMENTS"
                            className="mb-3"
                        >
                            <Upload
                                multiple
                                beforeUpload={(file) => {
                                    const maxSize = 10 * 1024 * 1024;

                                    if (file.size > maxSize) {
                                        message.error(`${file.name} exceeds the 10 MB limit.`);
                                        return Upload.LIST_IGNORE;
                                    }

                                    formik.setFieldValue('attachments', [
                                        ...(formik.values.attachments || []),
                                        file,
                                    ]);

                                    return false;
                                }}
                                onRemove={(file) => {
                                    formik.setFieldValue(
                                        'attachments',
                                        (formik.values.attachments || []).filter(
                                            (item) => item.uid !== file.uid
                                        )
                                    );
                                }}
                                fileList={(formik.values.attachments || []).map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: 'done',
                                    size: file.size,
                                    type: file.type,
                                }))}
                                showUploadList={{
                                    showPreviewIcon: false,
                                    showRemoveIcon: true,
                                }}
                            >
                                <Button icon={<PaperClipOutlined />}>
                                    Attach files
                                </Button>
                            </Upload>

                            <div className="text-muted small mt-2">
                                Attach screenshots, documents, or other files. Maximum size: 10 MB per file.
                            </div>
                        </FieldWrapper>
                    </div>

                    {/* Right Section */}
                    <div
                        className="col-4"
                        style={{
                            maxHeight: 'calc(90vh - 150px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}>
                        <FieldWrapper
                            formik={formik}
                            name="type"
                            label="TYPE"
                            required
                            className="col-12 mb-2"
                        >
                            <SelectInput
                                name="type"
                                id="type"
                                value={formik.values.type}
                                onChange={(value) =>
                                    formik.setFieldValue(
                                        'type',
                                        value ?? ''
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched('type', true)
                                }
                                placeholder="Select ticket type"
                                options={ticketTypeOptions.map((item) => ({
                                    value: item.value,
                                    label: (
                                        <div className="d-flex align-items-center gap-2">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    ),
                                }))}
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="priority"
                            label="PRORITY"
                            required
                            className="mb-2"
                        >
                            <SelectInput
                                name="priority"
                                id="priority"
                                value={formik.values.priority}
                                onChange={(value) => formik.setFieldValue(
                                    'priority',
                                    value ?? ''
                                )}
                                onBlur={() => formik.setFieldTouched('priority', true)}
                                placeholder="Select ticket priority"
                                options={ticketPriorityOptions.map((item) => ({
                                    value: item.value,
                                    label: (
                                        <div className="d-flex align-items-center gap-2">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    ),
                                }))}
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="startDate"
                            label="START DATE"
                            className="mb-2"
                        >
                            <DateInput
                                name="startDate"
                                value={formik.values.startDate}
                                onChange={(value) => formik.setFieldValue("startDate", value)}
                                onBlur={() => setFieldTouched("startDate")}
                                placeholder="Select start date"
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="dueDate"
                            label="DUE DATE"
                            className="mb-2"
                        >
                            <DateInput
                                name="dueDate"
                                value={formik.values.dueDate}
                                onChange={(value) => formik.setFieldValue("dueDate", value)}
                                onBlur={() => setFieldTouched("dueDate")}
                                placeholder="Select due date"
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="assignee"
                            label="ASSIGNED PERSON"
                            required
                            className="mb-2"
                        >
                            <SelectInput
                                name="text"
                                id="assignee"
                                value={formik.values.assignee || undefined}
                                onChange={(value) =>
                                    formik.setFieldValue('assignee', value ?? '')
                                }
                                onBlur={() => formik.setFieldTouched('assignee', true)}
                                placeholder="Select assigned to"
                                options={[
                                    {
                                        value: currentUser.id,
                                        label: (
                                            <div className="d-flex align-items-center gap-2">
                                                <Avatar
                                                    size={25}
                                                    icon={<UserOutlined />}
                                                    style={{
                                                        backgroundColor: '#e6f4ff',
                                                        color: '#1677ff',
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                <div className="d-flex flex-column">
                                                    <span className="fw-semibold text-primary">
                                                        Assign to me
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    },

                                    ...userOptions?.map((item) => {
                                        const name = item?.full_name || 'Unknown User';
                                        const email = item?.authId?.email || '';

                                        const initials = name
                                            .split(' ')
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join('')
                                            .toUpperCase();

                                        return {
                                            value: item?.authId?._id || item?.authId?.id,
                                            label: (
                                                <div className="d-flex align-items-center gap-2 py-1">
                                                    <Avatar
                                                        size={25}
                                                        style={{
                                                            backgroundColor: '#e6f4ff',
                                                            color: '#1677ff',
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {initials}
                                                    </Avatar>

                                                    <div className="d-flex flex-column overflow-hidden">
                                                        <span className="fw-semibold small text-dark text-truncate">
                                                            {name}
                                                        </span>

                                                        <span
                                                            className="small text-secondary text-truncate"
                                                            style={{ fontSize: 12 }}
                                                        >
                                                            {email}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        };
                                    }),
                                ]}
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="sprint"
                            label="ADD TO SPRINT"
                            required
                            className="col-12 mb-2"
                        >
                            <SelectInput
                                name="sprint"
                                id="sprint"
                                value={formik.values.sprint}
                                onChange={(value) => formik.setFieldValue('sprint', value)}
                                onBlur={() => formik.setFieldTouched('name', true)}
                                placeholder="Select sprint name"
                                options={sprintOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                }))}
                            />
                        </FieldWrapper>
                    </div>
                </div>


            </form>
        </Modal>
    );
};

export default AddTicket;