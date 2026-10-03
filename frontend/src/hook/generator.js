import dayjs from "dayjs";

export const getDayGreetings = () => {
    const hour = dayjs().hour();

    if (hour < 12) {
        return "Good Morning";
    }

    if (hour < 17) {
        return "Good Afternoon";
    }

    if (hour < 21) {
        return "Good Evening";
    }

    return "Good Night";
};