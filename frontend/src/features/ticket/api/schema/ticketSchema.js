import * as Yup from "yup";

export const addProjectSchemaValidation = Yup.object({
    name: Yup.string()
        .trim()
        .min(4, "Minimum 4 characters required")
        .max(100, "Project name cannot exceed 100 characters")
        .required("Project name is required"),

    members: Yup.array()
        .of(Yup.string().required())
        .min(1, "Please add at least one team member")
        .required("Please add at least one team member"),

    description: Yup.string()
        .test(
            "not-empty",
            "Project description is required",
            (value) => {
                if (!value) return false;

                // Remove HTML tags and whitespace from ReactQuill content
                const plainText = value
                    .replace(/<(.|\n)*?>/g, "")
                    .trim();

                return plainText.length > 0;
            }
        )
        .required("Project description is required"),
});