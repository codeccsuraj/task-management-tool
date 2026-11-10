import React, { useMemo } from "react";
import { Drawer, message } from "antd";
import { useFormik } from "formik";
import ReactQuill from "react-quill-new";

import ButtonInput from "../../../components/form/ButtonInput";
import TextInput from "../../../components/form/TextInput";
import FieldWrapper from "../../FieldWrapper";
import { addProjectSchemaValidation } from "../api/schema/ticketSchema";

const UpdateProject = ({
    isOpen = false,
    onClose,
    prevData,
}) => {

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: prevData?.name || "",
            description: prevData?.description || "",
        },

        validationSchema: addProjectSchemaValidation,

        onSubmit: async (values) => {
            try {
                const payload = {
                    projectId: prevData?._id,
                    name: values.name.trim(),
                    description: values.description,
                };

                console.log("Update Project Payload:", payload);

                message.success("Project details logged successfully");

            } catch (error) {
                console.error("Update project error:", error);
                message.error("Something went wrong");
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose?.();
    };

    return (
        <Drawer
            title="Update Project"
            open={isOpen}
            onClose={handleClose}
            size={750}
            destroyOnHidden
            footer={
                <div className="d-flex justify-content-end gap-2 py-1">
                    <ButtonInput
                        type="button"
                        label="Cancel"
                        variant="secondary"
                        className="btn-base btn-outline"
                        onClick={handleClose}
                    />

                    <ButtonInput
                        type="submit"
                        label="Save Changes"
                        variant="success"
                        className="btn-base btn-submit"
                        onClick={formik.handleSubmit}
                        loading={formik.isSubmitting}
                        disabled={formik.isSubmitting}
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
                                formik.setFieldValue("description", value)
                            }
                            onBlur={() =>
                                formik.setFieldTouched("description", true)
                            }
                        />
                    </div>
                </FieldWrapper>
            </div>
        </Drawer>
    );
};

export default UpdateProject;