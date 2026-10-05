import React from "react";
import { Drawer } from "antd";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import ButtonInput from "../../../components/form/ButtonInput";
import TextInput from "../../../components/form/TextInput";
import FieldWrapper from "../../FieldWrapper";

import { createUserSchemaValidation } from "../schema/userSchema";
import { useCreateUserMutation } from "../api/userApi";

const CreateUser = ({
    isOpen = false,
    onClose,
}) => {
    const [createUser, { isLoading },] = useCreateUserMutation();

    const formik = useFormik({
        initialValues: {
            full_name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            user_group : "TEAM"
        },

        validationSchema: createUserSchemaValidation,

        onSubmit: async (
            values,
            { setSubmitting, resetForm }
        ) => {
            try {
                const response = await createUser(values).unwrap();

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
            title="Add team member"
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
                    name="email"
                    label="EMAIL"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="email"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email"
                        autoComplete="email"
                    />
                </FieldWrapper>

                <FieldWrapper
                    formik={formik}
                    name="phone"
                    label="PHONE"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        maxLength={10}
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

                <FieldWrapper
                    formik={formik}
                    name="password"
                    label="CREATE PASSWORD"
                    required
                    className="mb-3"
                >
                    <TextInput
                        type="password"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Create password"
                        autoComplete="new-password"
                    />
                </FieldWrapper>
            </form>
        </Drawer>
    );
};

export default CreateUser;