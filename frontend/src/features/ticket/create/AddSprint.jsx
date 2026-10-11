
import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Drawer, message } from "antd";
import ReactQuill from "react-quill-new";

import FieldWrapper from "../../FieldWrapper";
import TextInput from "../../../components/form/TextInput";
import ButtonInput from "../../../components/form/ButtonInput";
import DateInput from "../../../components/form/DateInput";
import SelectInput from "../../../components/form/SelectInput";

import { useCreateSprintMutation, useGetMyProjectsQuery } from "../api/ticketApi";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getDateTimestamp = (value) => {
    if (!value) return null;

    const date =
        typeof value?.toDate === "function"
            ? value.toDate()
            : value instanceof Date
                ? value
                : new Date(value);

    const timestamp = date.getTime();

    return Number.isNaN(timestamp) ? null : timestamp;
};

const hasRichTextContent = (value = "") => {
    const plainText = value
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&#160;/gi, " ")
        .trim();

    return plainText.length > 0;
};

const initialValues = {
    project: "",
    name: "",
    goal: "",
    status: "planned",
    startDate: "",
    endDate: "",
};

// --------------------------------------------------
// Validation Schema
// --------------------------------------------------

const validationSchema = Yup.object({
    project: Yup.string()
        .required("Please select a project"),

    name: Yup.string()
        .trim()
        .min(3, "Sprint name must be at least 3 characters")
        .max(100, "Sprint name cannot exceed 100 characters")
        .required("Please enter sprint name"),

    startDate: Yup.mixed()
        .required("Please select start date")
        .test(
            "valid-start-date",
            "Please select a valid start date",
            (value) => getDateTimestamp(value) !== null
        ),

    endDate: Yup.mixed()
        .required("Please select end date")
        .test(
            "valid-end-date",
            "Please select a valid end date",
            (value) => getDateTimestamp(value) !== null
        )
        .test(
            "end-date-after-start",
            "End date must be on or after start date",
            function (value) {
                const { startDate } = this.parent;

                if (!startDate || !value) return true;

                const start = getDateTimestamp(startDate);
                const end = getDateTimestamp(value);

                if (start === null || end === null) return true;

                // Compare calendar dates, not time-of-day.
                const startDay = new Date(start);
                const endDay = new Date(end);

                startDay.setHours(0, 0, 0, 0);
                endDay.setHours(0, 0, 0, 0);

                return endDay >= startDay;
            }
        ),

    status: Yup.string()
        .oneOf(
            ["planned", "active", "completed"],
            "Please select a valid sprint status"
        )
        .required("Please select sprint status"),

    goal: Yup.string()
        .required("Please enter sprint goal")
        .test(
            "goal-content",
            "Please enter sprint goal",
            (value) => hasRichTextContent(value)
        ),
});

// --------------------------------------------------
// Add Sprint Component
// --------------------------------------------------

const AddSprint = ({ isOpen = false, onClose }) => {
    // Fetch projects only while the drawer is open.
    const {
        data: projectRes,
        isLoading: projectLoading,
        isFetching: projectFetching,
    } = useGetMyProjectsQuery(
        { page: 1, limit: 10 },
        { skip: !isOpen }
    );
    const [createSprint] = useCreateSprintMutation()

    // Project dropdown options.
    const projectOptions = useMemo(() => {
        const projects = projectRes?.data?.projects ?? [];

        return projects.map((project) => ({
            label: project.name,
            value: project._id,
        }));
    }, [projectRes?.data?.projects]);

    // Sprint status options.
    const statusOptions = useMemo(
        () => [
            { label: "Planned", value: "planned" },
            { label: "Active", value: "active" },
        ],
        []
    );

    // Formik configuration.
    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnBlur: true,
        validateOnChange: true,

        onSubmit: async (
            values,
            { setSubmitting, resetForm }
        ) => {
            try {
                const response = await createSprint(values).unwrap();

                console.log("This is res", response)
                message.success(
                    response?.message ||
                    "Team member created successfully"
                );

                resetForm();
                onClose?.();
            } catch (error) {
                message.error(
                    error?.data?.message ||
                    ""
                );
                console.error("Create project error:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Close drawer and reset form.
    const handleClose = () => {
        if (formik.isSubmitting) return;

        formik.resetForm();
        onClose?.();
    };

    // Reusable Formik field handlers.
    const setFieldValue = (name, value) => {
        formik.setFieldValue(name, value);
    };

    const setFieldTouched = (name) => {
        formik.setFieldTouched(name, true);
    };

    const handleDateChange = (name, value) => {
        setFieldValue(name, value);

        // Revalidate both dates when either date changes.
        formik.setFieldTouched(name, true, false);
        formik.validateField(name === "startDate" ? "endDate" : "startDate");
    };

    return (
        <Drawer
            title="Add Sprint"
            open={isOpen}
            onClose={handleClose}
            width={750}
            destroyOnHidden
            maskClosable={!formik.isSubmitting}
            keyboard={!formik.isSubmitting}
            footer={
                <div className="d-flex justify-content-end gap-3 py-1">
                    <ButtonInput
                        type="button"
                        label="Cancel"
                        className="btn-base btn-outline"
                        onClick={handleClose}
                        disabled={formik.isSubmitting}
                    />

                    <ButtonInput
                        type="button"
                        label="Save Sprint"
                        className="btn-base btn-submit"
                        onClick={() => formik.handleSubmit()}
                        loading={formik.isSubmitting}
                        disabled={formik.isSubmitting}
                    />
                </div>
            }
        >
            <form onSubmit={formik.handleSubmit} noValidate>
                <div className="row">
                    {/* Project */}
                    <FieldWrapper
                        formik={formik}
                        name="project"
                        label="PROJECT"
                        required
                        className="col-12 mb-3"
                    >
                        <SelectInput
                            name="project"
                            id="project"
                            value={formik.values.project || undefined}
                            onChange={(value) =>
                                setFieldValue("project", value ?? "")
                            }
                            onBlur={() => setFieldTouched("project")}
                            placeholder="Select project"
                            options={projectOptions}
                            showSearch
                            disabled={projectLoading || projectFetching}
                            loading={projectLoading || projectFetching}
                        />
                    </FieldWrapper>

                    {/* Sprint Name */}
                    <FieldWrapper
                        formik={formik}
                        name="name"
                        label="SPRINT NAME"
                        required
                        className="col-12 mb-3"
                    >
                        <TextInput
                            type="text"
                            name="name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter sprint name"
                        />
                    </FieldWrapper>

                    {/* Start Date */}
                    <FieldWrapper
                        formik={formik}
                        name="startDate"
                        label="START DATE"
                        required
                        className="col-lg-6 mb-3"
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

                    {/* End Date */}
                    <FieldWrapper
                        formik={formik}
                        name="endDate"
                        label="END DATE"
                        required
                        className="col-lg-6 mb-3"
                    >
                        <DateInput
                            name="endDate"
                            value={formik.values.endDate}
                            onChange={(value) =>
                                handleDateChange("endDate", value)
                            }
                            onBlur={() => setFieldTouched("endDate")}
                            placeholder="Select end date"
                        />
                    </FieldWrapper>

                    {/* Status */}
                    <FieldWrapper
                        formik={formik}
                        name="status"
                        label="STATUS"
                        required
                        className="col-12 mb-3"
                    >
                        <SelectInput
                            name="status"
                            id="status"
                            value={formik.values.status}
                            onChange={(value) =>
                                setFieldValue("status", value ?? "")
                            }
                            onBlur={() => setFieldTouched("status")}
                            placeholder="Select sprint status"
                            options={statusOptions}
                        />
                    </FieldWrapper>

                    {/* Sprint Goal */}
                    <FieldWrapper
                        formik={formik}
                        name="goal"
                        label="SPRINT GOAL"
                        required
                        className="col-12 mb-3"
                    >
                        <div className="description-editor">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.goal}
                                onChange={(value) =>
                                    setFieldValue("goal", value)
                                }
                                onBlur={() => setFieldTouched("goal")}
                                placeholder="Describe the sprint goal..."
                            />
                        </div>
                    </FieldWrapper>
                </div>
            </form>
        </Drawer>
    );
};

export default AddSprint;
