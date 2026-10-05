import * as Yup from 'yup';

export const addUserSchemaValidation = Yup.object({
    full_name: Yup.string()
        .trim()
        .required("Full name is required"),

    role: Yup.string()
        .trim()
        .required("Job title is required"),

    phone: Yup.string()
        .matches(
            /^[0-9]{10}$/,
            "Phone number must be exactly 10 digits"
        )
        .required("Phone number is required"),

    date_of_birth: Yup.string()
        .required("Date of birth is required"),

    gender: Yup.string()
        .required("Gender is required"),

    address: Yup.string()
        .trim()
        .required("Location is required"),

    bio: Yup.string()
        .trim()
        .required("Bio is required"),
});

export const createUserSchemaValidation = Yup.object({
    full_name: Yup.string()
        .trim()
        .required("Full name is required"),

    role: Yup.string()
        .trim()
        .required("Job title is required"),

    email: Yup.string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email is required"),

    phone: Yup.string()
        .trim()
        .matches(
            /^[0-9]{10}$/,
            "Phone number must be exactly 10 digits"
        )
        .required("Phone number is required"),

    password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
});

export const updateUserSchemaValidation = Yup.object({
    full_name: Yup.string()
        .trim()
        .required("Full name is required"),

    role: Yup.string()
        .trim()
        .required("Job title is required"),
});


