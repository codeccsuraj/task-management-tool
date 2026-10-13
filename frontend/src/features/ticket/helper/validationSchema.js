import * as Yup from 'yup';
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 5;

export const isValidDate = (value) => {
    if (!value) return true;

    if (typeof value?.isValid === 'function') {
        return value.isValid();
    }

    return !Number.isNaN(new Date(value).getTime());
};

export const ticketValidationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .min(3, 'Summary must be at least 3 characters')
        .max(200, 'Summary cannot exceed 200 characters')
        .required('Summary is required'),

    description: Yup.string()
        .max(20000, 'Description is too long'),

    type: Yup.string()
        .required('Please select a ticket type'),

    priority: Yup.string()
        .required('Please select a priority'),

    assignee: Yup.string()
        .required('Please select an assignee'),

    sprint: Yup.string().nullable(),

    startDate: Yup.mixed()
        .nullable()
        .test(
            'valid-start-date',
            'Please select a valid start date',
            isValidDate
        ),

    dueDate: Yup.mixed()
        .nullable()
        .test(
            'valid-due-date',
            'Please select a valid due date',
            isValidDate
        )
        .test(
            'due-after-start',
            'Due date cannot be earlier than start date',
            function (dueDate) {
                const { startDate } = this.parent;

                if (!startDate || !dueDate) return true;

                const start = new Date(
                    typeof startDate?.toDate === 'function'
                        ? startDate.toDate()
                        : startDate
                );

                const due = new Date(
                    typeof dueDate?.toDate === 'function'
                        ? dueDate.toDate()
                        : dueDate
                );

                return due >= start;
            }
        ),

    attachments: Yup.array()
        .max(MAX_FILES, `You can attach up to ${MAX_FILES} files`)
        .of(
            Yup.mixed().test(
                'file-size',
                'Each file must be 10 MB or smaller',
                (file) => !file || file.size <= MAX_FILE_SIZE
            )
        ),
});