import React from "react";
import FieldWrapper from "../FieldWrapper";
import TextInput from "../../components/form/TextInput";
import ButtonInput from "../../components/form/ButtonInput";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registerValidationSchema } from "./schema/authSchema";
import { useRegisterMutation } from "./api/authApi";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { setUser } from "./slice/authSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [register, { isLoading }] = useRegisterMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: registerValidationSchema,

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await register(values).unwrap();
                dispatch(setUser(response?.data?.user));
                toast.success(response?.message || "");
                navigate("/")
            } catch (error) {
                console.error("Registration failed:", error);
                toast.error(error?.data?.message || "")
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="container-fluid p-0">
            <div className="row g-0 min-vh-100">
                <div
                    className="col-lg-4 d-none d-lg-flex flex-column justify-content-between text-white p-5"
                    style={{ background: '#1B2420' }}
                >
                    <div className="d-flex align-items-center gap-2 fw-bold fs-4">
                        <span
                            className="d-inline-flex align-items-center justify-content-center rounded"
                            style={{ width: 32, height: 32, background: 'var(--color-brand, #2F6F4E)', fontSize: 16 }}
                        >
                            T
                        </span>
                        Trackline
                    </div>

                    <div>
                        <h2 className="fw-bold lh-sm mb-3" style={{ maxWidth: 440 }}>
                            Plan sprints. Track tickets.<br />Ship with your team.
                        </h2>
                        <p className="mb-0" style={{ color: '#9AA69F', maxWidth: 400 }}>
                            A lightweight home for backlogs, sprint boards and the work your team ships every week.
                        </p>
                    </div>

                    <small style={{ color: '#7C8981' }}>© 2026 Trackline Inc.</small>
                </div>
                <div className="col-lg d-flex align-items-center justify-content-center p-4" style={{ background: '#F2F1EC' }}>
                    <div className="w-100" style={{ maxWidth: 420 }}>
                        <div className="d-lg-none fw-bold fs-4 mb-4 text-center">Trackline</div>

                        <h3 className="fw-bold mb-1">Create your account</h3>
                        <p className="text-secondary mb-4">Start tracking tickets and sprints in minutes</p>

                        <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">

                            {/* Email */}
                            <FieldWrapper formik={formik} name="email" label="Email" required>
                                <TextInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control-lg"
                                    placeholder="name@company.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FieldWrapper>

                            {/* Password */}
                            <FieldWrapper formik={formik} name="password" label="Password" required>
                                <TextInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control-lg"
                                    placeholder="Enter password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FieldWrapper>

                            {/* Submit */}
                            <ButtonInput
                                type="submit"
                                label={isLoading ? 'Signing up...' : 'Sign up'}
                                loading={isLoading || formik.isSubmitting}
                                className="btn-submit w-100"
                            />
                        </form>

                        <p className="text-center text-secondary small mt-4 mb-0">
                            Already have an account?{' '}
                            <Link to="/login" className="fw-semibold text-decoration-none login-link">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;