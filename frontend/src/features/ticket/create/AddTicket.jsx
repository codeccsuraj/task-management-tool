import React from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill-new';
import { Upload, Button, message, Modal } from 'antd';
import { PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';

import TextInput from '../../../components/form/TextInput';
import FieldWrapper from '../../FieldWrapper';
import SelectInput from '../../../components/form/SelectInput';
import { ticketPriorityOptions, ticketTypeOptions } from '../helper/ticketVar';
import DateInput from '../../../components/form/DateInput';

const AddTicket = ({
    open = false,
    onClose,
}) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            type: null,
            startDate: null,
            dueDate: null,
        },
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                console.log('Ticket values:', values);
            } catch (error) {
                console.error('Create ticket error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

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
            <form onSubmit={formik.handleSubmit}>
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
                    <div className="col-4">
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
                                value={formik.values.type || undefined}
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
                            name="type"
                            label="PRORITY"
                            required
                            className="mb-2"
                        >
                            <SelectInput
                                name="type"
                                id="type"
                                value={formik.values.type || undefined}
                                onChange={(value) =>
                                    formik.setFieldValue(
                                        'type',
                                        value ?? ''
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched('type', true)
                                }
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
                                onChange={(value) =>
                                    handleDateChange("startDate", value)
                                }
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
                                onChange={(value) =>
                                    handleDateChange("dueDate", value)
                                }
                                onBlur={() => setFieldTouched("dueDate")}
                                placeholder="Select due date"
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            formik={formik}
                            name="type"
                            label="ASSIGNED PERSON"
                            required
                            className="mb-2"
                        >
                            <SelectInput
                                name="type"
                                id="type"
                                value={formik.values.type || undefined}
                                onChange={(value) =>
                                    formik.setFieldValue(
                                        'type',
                                        value ?? ''
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched('type', true)
                                }
                                placeholder="Select assigned to"
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
                    </div>
                </div>


            </form>
        </Modal>
    );
};

export default AddTicket;