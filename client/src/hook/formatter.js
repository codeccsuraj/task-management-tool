import dayjs from "dayjs";

export const formatDate = (date, format = "DD-MM-YYYY") => {
    if (!date) return null;

    const parsedDate = dayjs(date);

    if (!parsedDate.isValid()) return null;

    return parsedDate.format(format);
};