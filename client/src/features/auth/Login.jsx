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
    const [login, { isLoading }] = useLoginMutation()

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
        <div className='container-fluid'>
            <div className='container-sm'>
                <div className="row min-vh-100 align-items-center justify-content-center">
                    <div className="col-lg-6 ">
                        <div className='p-4 bg-light rounded shadow'>
                            <div className='mb-3 text-center'>
                                <h3 className='fw-bold display-6'>Login to continue</h3>
                            </div>
                            {/* Form */}
                            <form
                                onSubmit={formik.handleSubmit}
                                className="d-flex flex-column gap-3"
                            >

                                {/* Email */}
                                <FieldWrapper
                                    formik={formik}
                                    name="email"
                                    label="Email"
                                    required
                                >
                                    <TextInput
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control-lg"
                                        placeholder="Enter Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </FieldWrapper>

                                {/* Password */}
                                <FieldWrapper
                                    formik={formik}
                                    name="password"
                                    label="Password"
                                    required
                                >
                                    <TextInput
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control-lg"
                                        placeholder="Create Password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </FieldWrapper>

                                {/* Submit */}
                                <div>
                                    <ButtonInput
                                        type="submit"
                                        label={isLoading ? "Registering..." : "Register"}
                                        loading={isLoading || formik.isSubmitting}
                                        className="btn-submit w-100"
                                    />
                                </div>

                            </form>
                            <div className='mt-4'>
                                <ul className='nav flex-column'>
                                    <li className='nav-item'>
                                        <span className='d-flex align-items-center gap-1'>Create an account now.<Link to="/register" className='nav-link m-0 p-0'>Sign up</Link></span>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link m-0 p-0'>Forgot Password</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
