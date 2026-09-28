import React from 'react'
import FieldWrapper from '../../FieldWrapper'
import TextInput from '../../../components/form/TextInput'
import ButtonInput from '../../../components/form/ButtonInput'
import { useFormik } from 'formik'
import DateInput from '../../../components/form/DateInput'

const UpdateUser = () => {
    const formik = useFormik({
        initialValues: {
            full_name: "",
            phone: "",
            date_of_birth: "",
            gender: "",
            address: "",
            bio: "",
            role: ""
        },
        onSubmit: async (values) => {
            console.log("values", values)
        }
    })
    return (
        <div className='container-fluid'>
            <form action="" className='w-75 row bg-white rounded-lg border p-4'>
                <FieldWrapper formik={formik} name="full_name" label="FULL NAME" required className='col-lg-6 mb-2'>
                    <TextInput
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        placeholder="Enter full name"
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="role" label="JOB TITLE" required className='col-lg-6 mb-2'>
                    <TextInput
                        type="text"
                        name="role"
                        id="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        placeholder="Enter job title"
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="phone" label="PHONE" required className='col-lg-6 mb-2'>
                    <TextInput
                        type="text"
                        name="phone"
                        id="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        placeholder="Enter phone"
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="date_of_birth" label="DATE OF BIRTH" required className='col-lg-6 mb-2'>
                    <DateInput
                        value={formik.values.date_of_birth}
                        onChange={(val) => formik.setFieldValue(val)}
                        placeholder='Enter Date of birth'
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="email" label="GENDER" required className='col-lg-6 mb-2'>
                    <TextInput
                        type="email"
                        name="email"
                        id="email"
                        placeholder="name@company.com"
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="address" label="LOCATION" required className='col-lg-6 mb-2'>
                    <TextInput
                        type="text"
                        name="address"
                        id="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        placeholder="Enter your location"
                    />
                </FieldWrapper>
                <FieldWrapper formik={formik} name="bio" label="BIO" required className='col-lg-12 mb-3'>
                    <textarea
                        name="bio"
                        rows={4}
                        id="bio"
                        className="form-control"
                        placeholder="Enter your bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                    />
                </FieldWrapper>

                <div className='d-flex justify-content-end gap-3'>
                    <ButtonInput
                        type='button'
                        label='Cancel'
                        className='btn-outline'
                    />
                    <ButtonInput
                        type='button'
                        label='Save changes'
                        className='btn-submit'
                    />
                </div>
            </form>
        </div>
    )
}

export default UpdateUser
