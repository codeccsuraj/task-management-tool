import React, { useMemo } from "react";
import { Drawer, message } from "antd";
import { useFormik } from "formik";
import ReactQuill from "react-quill-new";

import ButtonInput from "../../../components/form/ButtonInput";
import TextInput from "../../../components/form/TextInput";
import FieldWrapper from "../../FieldWrapper";

import { useGetUsersQuery } from "../../user/api/userApi";
import MultiSelectInput from "../../../components/form/MultiSelectInput ";
import { useCreateProjectMutation } from "../api/ticketApi";
import { addProjectSchemaValidation } from "../api/schema/ticketSchema";

const AddProject = ({
    isOpen = false,
    onClose,
}) => {
    const [createProject, { isLoading }] = useCreateProjectMutation()
    const {
        data,
        isLoading: isUsersLoading,
    } = useGetUsersQuery({
        page: 1,
        limit: 10,
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            members: [],
            description: "",
        },
        validationSchema: addProjectSchemaValidation,
        onSubmit: async (
            values,
            { setSubmitting, resetForm }
        ) => {
            try {
                const response = await createProject(values).unwrap();

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

    const userOptions = useMemo(() => {
        return (
            data?.data?.users
                ?.map((item) => ({
                    label: item?.authId?.email,
                    value: item?.authId?._id,
                })) || []
        );
    }, [data?.users]);

    const handleClose = () => {
        formik.resetForm();
        onClose?.();
    };

    const isSubmitting = formik.isSubmitting || isLoading;

    return (
        <Drawer
            title="Add Project"
            open={isOpen}
            onClose={handleClose}
            size={750}
            destroyOnHidden
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
                        type="submit"
                        label="Save Changes"
                        className="btn-base btn-submit"
                        onClick={formik.handleSubmit}
                        loading={isSubmitting}
                    />
                </div>
            }
        >
            <div>
                {/* Project Name */}
                <FieldWrapper
                    formik={formik}
                    name="name"
                    label="PROJECT TITLE"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="text"
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter project title"
                    />
                </FieldWrapper>

                {/* Members */}
                <FieldWrapper
                    formik={formik}
                    name="members"
                    label="ADD MEMBERS"
                    required
                    className="mb-3"
                >
                    <MultiSelectInput
                        name="members"
                        id="members"
                        options={userOptions}
                        value={formik.values.members}
                        onChange={(value) =>
                            formik.setFieldValue("members", value)
                        }
                        onBlur={() =>
                            formik.setFieldTouched("members", true)
                        }
                        placeholder="Select team members"
                        showSearch
                        disabled={isUsersLoading}
                        loading={isUsersLoading}
                    />
                </FieldWrapper>

                {/* Description */}
                <FieldWrapper
                    formik={formik}
                    name="description"
                    label="DESCRIPTION"
                    required
                    className="mb-3"
                >
                    <div className="description-editor">
                        <ReactQuill
                            theme="snow"
                            value={formik.values.description}
                            onChange={(value) =>
                                formik.setFieldValue(
                                    "description",
                                    value
                                )
                            }
                            onBlur={() =>
                                formik.setFieldTouched(
                                    "description",
                                    true
                                )
                            }
                        />
                    </div>
                </FieldWrapper>
            </div>
        </Drawer>
    );
};

export default AddProject;