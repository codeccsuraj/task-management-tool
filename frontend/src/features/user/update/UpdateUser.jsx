import React from "react";
import { useFormik } from "formik";
import FieldWrapper from "../../FieldWrapper";
import TextInput from "../../../components/form/TextInput";
import ButtonInput from "../../../components/form/ButtonInput";
import DateInput from "../../../components/form/DateInput";
import { addUserSchemaValidation } from "../schema/userSchema";
import SelectInput from "../../../components/form/SelectInput";
import { useUpsertByAuthIdMutation } from "../api/userApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const UpdateUser = ({
    onClose,
    userData
}) => {
    const user = useSelector((state) => state.auth.user)
    const [upsertByAuthId] = useUpsertByAuthIdMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            full_name: userData?.full_name || "",
            role: userData?.role || "",
            phone: userData?.phone || "",
            date_of_birth: userData?.date_of_birth || "",
            gender: userData?.gender || "",
            address: userData?.address || "",
            bio: userData?.bio || "",
            user_group : "TEAM",
        },
        validationSchema: addUserSchemaValidation,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await upsertByAuthId({
                    id: user.id,
                    data: values
                }).unwrap();
                onClose?.();
                resetForm();
                toast.success(response?.message || "");
            } catch (error) {
                console.error("Registration failed:", error);
                toast.error(error?.data?.message || "")
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-9 col-lg-10 col-md-12">
                    {/* Form Card */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">

                            <form onSubmit={formik.handleSubmit}>

                                <div className="row">

                                    {/* Full Name */}
                                    <FieldWrapper formik={formik} name="full_name" label="FULL NAME" required className="col-lg-6 mb-2">
                                        <TextInput
                                            type="text"
                                            name="full_name"
                                            id="full_name"
                                            value={formik.values.full_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter full name"
                                        />
                                    </FieldWrapper>

                                    {/* Job Title */}
                                    <FieldWrapper formik={formik} name="role" label="JOB TITLE" required className="col-lg-6  mb-2">
                                        <TextInput
                                            type="text"
                                            name="role"
                                            id="role"
                                            value={formik.values.role}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter job title"
                                        />
                                    </FieldWrapper>

                                    {/* Phone */}
                                    <FieldWrapper formik={formik} name="phone" label="PHONE" required className="col-lg-6 mb-2">
                                        <TextInput
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter 10 digit phone number"
                                        />
                                    </FieldWrapper>

                                    {/* Date of Birth */}
                                    <FieldWrapper formik={formik} name="date_of_birth" label="DATE OF BIRTH" required className="col-lg-6  mb-2">
                                        <DateInput
                                            name="date_of_birth"
                                            value={formik.values.date_of_birth}
                                            onChange={(value) => formik.setFieldValue("date_of_birth", value)}
                                            onBlur={() => formik.setFieldTouched("date_of_birth", true)}
                                            placeholder="Select date of birth"
                                            disabledDate={(current) => current && current.isAfter(dayjs(), "day")}
                                        />
                                    </FieldWrapper>

                                    {/* Gender */}
                                    <FieldWrapper
                                        formik={formik}
                                        name="gender"
                                        label="GENDER"
                                        required
                                        className="col-lg-6 mb-2"
                                    >
                                        <SelectInput
                                            name="gender"
                                            id="gender"
                                            value={formik.values.gender}
                                            onChange={(value) => formik.setFieldValue("gender", value)}
                                            onBlur={() => formik.setFieldTouched("gender", true)}
                                            placeholder="Select gender"
                                            options={[
                                                {
                                                    value: "male",
                                                    label: "Male",
                                                },
                                                {
                                                    value: "female",
                                                    label: "Female",
                                                },
                                                {
                                                    value: "other",
                                                    label: "Other",
                                                },
                                            ]}
                                        />
                                    </FieldWrapper>

                                    {/* Location */}
                                    <FieldWrapper
                                        formik={formik}
                                        name="address"
                                        label="LOCATION"
                                        required
                                        className="col-lg-6  mb-2"
                                    >
                                        <TextInput
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your location"
                                        />
                                    </FieldWrapper>

                                    {/* Bio */}
                                    <FieldWrapper
                                        formik={formik}
                                        name="bio"
                                        label="BIO"
                                        required
                                        className="col-lg-12 mb-2"
                                    >
                                        <textarea
                                            name="bio"
                                            id="bio"
                                            rows={5}
                                            className="form-control"
                                            placeholder="Tell us something about yourself..."
                                            value={formik.values.bio}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FieldWrapper>

                                </div>

                                {/* Buttons */}
                                <div className="border-top pt-4 mt-2 d-flex justify-content-end gap-3">

                                    <ButtonInput
                                        type="button"
                                        label="Cancel"
                                        className="btn-outline"
                                        onClick={() => onClose?.()}
                                    />

                                    <ButtonInput
                                        type="submit"
                                        label="Save Changes"
                                        className="btn-submit"
                                        disabled={formik.isSubmitting}
                                        loading={formik.isSubmitting}
                                    />

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;