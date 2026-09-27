import * as Yup from 'yup';

export const registerValidationSchema = Yup.object({
    email: Yup.string().lowercase().trim().required("Email is required"),
    password: Yup.string().min(4, "Password should have atleast 4 character").required("Email is required"),
});

export const loginValidationSchema = Yup.object({
    email: Yup.string().lowercase().trim().required("Email is required"),
    password: Yup.string().min(4, "Password should have atleast 4 character").required("Email is required"),
})