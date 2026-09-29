import React from 'react'
import FieldWrapper from '../FieldWrapper'
import TextInput from '../../components/form/TextInput'
import ButtonInput from '../../components/form/ButtonInput'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginValidationSchema } from './schema/authSchema'
import { useFormik } from 'formik'
import { useLoginMutation } from './api/authApi'
import toast from 'react-hot-toast'
import { setUser } from './slice/authSlice'


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: loginValidationSchema,

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await login(values).unwrap();
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

                {/* Left: brand panel (hidden on mobile) */}
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

                {/* Right: form */}
                <div
                    className="col-lg d-flex align-items-center justify-content-center p-4"
                    style={{ background: 'var(--color-bg, #F2F1EC)' }}
                >
                    <div className="w-100" style={{ maxWidth: 420 }}>

                        {/* Mobile-only logo */}
                        <div className="d-lg-none fw-bold fs-4 mb-4 text-center">Trackline</div>

                        <h3 className="fw-bold mb-1">Welcome back</h3>
                        <p className="text-secondary mb-4">Log in to continue to your workspace.</p>

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

                            {/* Forgot password */}
                            <div className="text-end">
                                <Link to="/forgot-password" className="small fw-semibold text-decoration-none login-link">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <ButtonInput
                                type="submit"
                                label={isLoading ? 'Logging in...' : 'Log in'}
                                loading={isLoading || formik.isSubmitting}
                                className="btn-submit w-100"
                            />
                        </form>

                        <p className="text-center text-secondary small mt-4 mb-0">
                            Don't have an account?{' '}
                            <Link to="/register" className="fw-semibold text-decoration-none login-link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
