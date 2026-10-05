import React from "react";
import { Drawer } from "antd";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import ButtonInput from "../../../components/form/ButtonInput";
import TextInput from "../../../components/form/TextInput";
import FieldWrapper from "../../FieldWrapper";

import { updateUserSchemaValidation } from "../schema/userSchema";
import { useUpdateUserMutation } from "../api/userApi";

const UpdateTeam = ({
    prevData,
    isOpen = false,
    onClose,
}) => {
    const [updateUser, { isLoading },] = useUpdateUserMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            full_name: prevData?.full_name || "",
            role: prevData?.role || "",
            user_group: "TEAM"
        },

        validationSchema: updateUserSchemaValidation,

        onSubmit: async (
            values,
            { setSubmitting, resetForm }
        ) => {
            try {
                const response = await updateUser(values).unwrap();

                toast.success(
                    response?.message ||
                    "Team member created successfully"
                );

                resetForm();
                onClose?.();
            } catch (error) {
                console.error(
                    "Create user failed:",
                    error
                );

                toast.error(
                    error?.data?.message ||
                    "Failed to create team member"
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose?.();
    };

    const isSubmitting = formik.isSubmitting || isLoading;

    return (
        <Drawer
            title="Update/View team member"
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
                        onClick={handleClose}
                        disabled={isSubmitting}
                    />

                    <ButtonInput
                        type="submit"
                        label={
                            isSubmitting
                                ? "Creating..."
                                : "Save Changes"
                        }
                        className="btn-base btn-submit"
                        loading={isSubmitting}
                        onClick={formik.handleSubmit}
                    />
                </div>
            }
        >
            <form
                onSubmit={formik.handleSubmit}
                noValidate
            >
                <FieldWrapper
                    formik={formik}
                    name="full_name"
                    label="FULL NAME"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter full name"
                        autoComplete="name"
                    />
                </FieldWrapper>

                <FieldWrapper
                    formik={formik}
                    name="role"
                    label="ROLE"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="text"
                        name="role"
                        id="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter role"
                    />
                </FieldWrapper>
            </form>
        </Drawer>
    );
};

export default UpdateTeam;