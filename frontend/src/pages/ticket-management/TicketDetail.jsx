import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, Empty, Spin } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';

import { useGetProjectTeamQuery, useGetTicketByIdQuery, useUpdateTicketFieldsMutation } from '../../features/ticket/api/ticketApi';
import {
    ticketPriorityOptions,
    ticketStatusOptions,
    ticketTypeOptions,
} from '../../features/ticket/helper/ticketVar';
import Heading from '../../components/custom/Heading';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import TextEditor from '../../components/editor/TextEditor';
import ButtonInput from '../../components/form/ButtonInput';
import UploadedFilesPreview from './helper/UploadedFilesPreview';
import TicketFooter from './TicketFooter';

/* ----------------------------- helpers ----------------------------- */

// Fields the user can edit on this page
const EDITABLE_FIELDS = [
    'title',
    'description',
    'status',
    'type',
    'priority',
    'startDate',
    'dueDate',
    'assignee',
];

// Build the editable form object from the API ticket
const buildFormState = (ticket) => ({
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    status: ticket?.status ?? undefined,
    type: ticket?.type ?? undefined,
    priority: ticket?.priority ?? undefined,
    startDate: ticket?.startDate ?? null,
    dueDate: ticket?.dueDate ?? null,
    assignee: ticket?.assigned?._id ?? undefined,
});

// Normalise values so "same" values always compare equal
// (Quill emits "<p><br></p>" for empty content, dayjs/moment objects vs ISO strings, etc.)
const normalize = (field, value) => {
    if (value === undefined || value === null || value === '') return '';
    if (field === 'description') {
        return value === '<p><br></p>' ? '' : value;
    }
    if (field === 'startDate' || field === 'dueDate') {
        if (typeof value?.toISOString === 'function') return value.toISOString();
        return String(value);
    }
    return value;
};

// Accepts either an input event or a plain value
const extractValue = (eventOrValue) =>
    eventOrValue && eventOrValue.target !== undefined ? eventOrValue.target.value : eventOrValue;

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

const getInitials = (name) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

/* ---------------------------- small pieces ---------------------------- */

const Field = ({ id, label, changed, children }) => (
    <div className="mb-3">
        <label htmlFor={id} className="form-label d-flex align-items-center gap-2 mb-1 fw-medium">
            {label}
            {changed && (
                <span
                    className="rounded-circle d-inline-block"
                    style={{ width: 6, height: 6, background: '#fa8c16' }}
                    title="Unsaved change"
                />
            )}
        </label>
        {children}
    </div>
);

/* ------------------------------ component ------------------------------ */

const TicketDetail = () => {
    const { ticketId } = useParams();
    const [pendingImages, setPendingImages] = useState([]);
    const { data: ticketRes, isLoading: ticketLoading } = useGetTicketByIdQuery(ticketId, {
        skip: !ticketId,
    });
    const [updateTicketFields] = useUpdateTicketFieldsMutation()
    const ticketData = ticketRes?.data;

    const { data: teamRes } = useGetProjectTeamQuery(ticketData?.project, {
        skip: !ticketData?.project,
    });

    // Baseline (what is saved) and the working copy (what the user is editing)
    const [initialForm, setInitialForm] = useState(null);
    const [form, setForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Load / reload the form whenever the ticket arrives or changes
    useEffect(() => {
        if (ticketData) {
            const next = buildFormState(ticketData);
            setInitialForm(next);
            setForm(next);
        }
    }, [ticketData]);

    // Which fields differ from the saved ticket
    const changedFields = useMemo(() => {
        if (!form || !initialForm) return [];
        return EDITABLE_FIELDS.filter(
            (field) => normalize(field, form[field]) !== normalize(field, initialForm[field])
        );
    }, [form, initialForm]);

    const isDirty = changedFields.length > 0;

    const setField = (field) => (eventOrValue) =>
        setForm((prev) => ({ ...prev, [field]: extractValue(eventOrValue) }));

    // Team members -> assignee options
    const assigneeOptions = useMemo(() => {
        const members = teamRes?.data || [];
        return members
            .map((item) => {
                const userId = item?.user?._id;
                const name = item?.user?.user?.full_name?.trim() || 'Unknown user';
                return {
                    value: userId,
                    label: (
                        <div className="d-flex align-items-center gap-2">
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
                                {getInitials(name)}
                            </Avatar>
                            <span className="fw-medium small text-truncate">{name}</span>
                        </div>
                    ),
                };
            })
            .filter((option) => option.value);
    }, [teamRes]);

    const statusOptions = useMemo(() => withIcons(ticketStatusOptions), []);
    const typeOptions = useMemo(() => withIcons(ticketTypeOptions), []);
    const priorityOptions = useMemo(() => withIcons(ticketPriorityOptions), []);

    const handleReset = () => setForm(initialForm);

    const handleSave = async () => {
        if (!isDirty) return;

        // Only the fields the user actually changed
        const changes = changedFields.reduce((acc, field) => {
            acc[field] = form[field];
            return acc;
        }, {});

        // Payload shaped for the API (assignee -> assigned)
        const payload = { ...form, assigned: form.assignee };
        delete payload.assignee;

        console.group(`Ticket ${ticketId} - save changes`);
        console.log('Changed fields:', changedFields);
        console.log('Changes (new values):', changes);
        console.log(
            'Before -> after:',
            changedFields.reduce((acc, field) => {
                acc[field] = { from: initialForm[field], to: form[field] };
                return acc;
            }, {})
        );
        console.log('Full form values:', form);
        console.log('Payload for API:', payload);
        console.groupEnd();

        setIsSaving(true);
        try {
            // TODO: call your update mutation here, e.g.
            // await updateTicket({ id: ticketId, ...changes }).unwrap();

            // Treat the current values as the new saved state
            setInitialForm(form);
        } catch (error) {
            console.error('Failed to save ticket:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusUpdate = async (val) => {
        try {
            setField('status')(val);
            const payload = {
                status: val,
            }

            const result = await updateTicketFields({
                ticketId: ticketData?._id,
                data: payload,
                event: "status_changed"
            }).unwrap();

            console.log("Ticket status updated successfully", result)
        } catch (error) {
            console.error("Error occurred while updating status", error)
        }
    }

    const handlePriorityUpdate = async (val) => {
        try {
            setField('priority')(val);
            const payload = {
                priority: val,
            }

            const result = await updateTicketFields({
                ticketId: ticketData?._id,
                data: payload,
                event: "priority_changed"
            }).unwrap();

            console.log("Ticket status updated successfully", result)
        } catch (error) {
            console.error("Error occurred while updating status", error)
        }
    }

    /* ----------------------------- render ----------------------------- */

    if (ticketLoading || (ticketData && !form)) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <Spin size="large" description="Loading ticket..." />
            </div>
        );
    }

    if (!ticketData || !form) {
        return (
            <div className="container-fluid py-5">
                <Empty description="This ticket could not be found." />
            </div>
        );
    }

    const isChanged = (field) => changedFields.includes(field);

    return (
        <div className="container-fluid">
            {/* Heading row with the Save button pinned to the right */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <Heading title="Ticket details" />

                {isDirty && (
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted d-none d-md-inline">
                            {changedFields.length} unsaved {changedFields.length === 1 ? 'change' : 'changes'}
                        </span>
                        <Button icon={<UndoOutlined />} onClick={handleReset} disabled={isSaving}>
                            Discard
                        </Button>
                        <ButtonInput
                            type="button"
                            className="btn-submit"
                            label="Save changes"
                            onClick={handleSave}
                        />
                    </div>
                )}
            </div>

            <div className="row g-4">
                {/* Main column */}
                <div className="col-12 col-lg-8">
                    <div className="bg-white border rounded-3 p-3 p-md-4">
                        <Field id="ticket-title" label="Summary" changed={isChanged('title')}>
                            <TextInput
                                id="ticket-title"
                                name="title"
                                type="text"
                                value={form.title}
                                placeholder="Short summary of the ticket"
                                onChange={setField('title')}
                            />
                        </Field>

                        <Field id="ticket-description" label="Description" changed={isChanged('description')}>
                            <TextEditor
                                value={form.description}
                                className="bg-white"
                                onChange={setField('description')}
                                maxHeight={300}
                                onPendingImagesChange={(newImages) => {
                                    setPendingImages((prev) => [
                                        ...prev,
                                        ...newImages,
                                    ]);
                                }}
                            />
                        </Field>
                        <div>
                            <UploadedFilesPreview files={pendingImages} />
                        </div>
                    </div>
                    <TicketFooter ticketId={ticketData?._id} />
                </div>

                {/* Sidebar */}
                <div className="col-12 col-lg-4">
                    <div className="bg-white border rounded-3 p-3 p-md-4">
                        <Field id="status" label="Status" changed={isChanged('status')}>
                            <SelectInput
                                name="status"
                                id="status"
                                value={form.status}
                                placeholder="Select status"
                                options={statusOptions}
                                onChange={handleStatusUpdate}
                            />
                        </Field>

                        <Field id="type" label="Type" changed={isChanged('type')}>
                            <SelectInput
                                name="type"
                                id="type"
                                value={form.type}
                                placeholder="Select ticket type"
                                options={typeOptions}
                                onChange={setField('type')}
                            />
                        </Field>

                        <Field id="priority" label="Priority" changed={isChanged('priority')}>
                            <SelectInput
                                name="priority"
                                id="priority"
                                value={form.priority}
                                placeholder="Select ticket priority"
                                options={priorityOptions}
                                onChange={handlePriorityUpdate}
                            />
                        </Field>

                        <Field id="assignee" label="Assignee" changed={isChanged('assignee')}>
                            <SelectInput
                                name="assignee"
                                id="assignee"
                                value={form.assignee}
                                placeholder="Select assignee"
                                options={assigneeOptions}
                                onChange={setField('assignee')}
                            />
                        </Field>

                        <div className="row">
                            <div className="col-6">
                                <Field id="startDate" label="Start date" changed={isChanged('startDate')}>
                                    <DateInput
                                        name="startDate"
                                        id="startDate"
                                        value={form.startDate}
                                        placeholder="Start date"
                                        onChange={setField('startDate')}
                                    />
                                </Field>
                            </div>
                            <div className="col-6">
                                <Field id="dueDate" label="Due date" changed={isChanged('dueDate')}>
                                    <DateInput
                                        name="dueDate"
                                        id="dueDate"
                                        value={form.dueDate}
                                        placeholder="Due date"
                                        onChange={setField('dueDate')}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;