import React from 'react'
import goodMorning from '../../assets/bg/morning.png'
import goodAfternoon from '../../assets/bg/afternoon.png'
import goodEvening from '../../assets/bg/night.png'
import Heading from '../../components/custom/Heading';

const greetingConfig = {
    morning: {
        image: goodMorning,
        gradient: "linear-gradient(120deg, #FFF7E6 0%, #FFE4B5 50%, #FFD6A0 100%)",
        accent: "#B7791F",
        subtitle: "A fresh start to make great things happen.",
    },
    afternoon: {
        image: goodAfternoon,
        gradient: "linear-gradient(120deg, #EAF5FF 0%, #D5E8FF 50%, #C4D8FF 100%)",
        accent: "#2563EB",
        subtitle: "Here's what's moving across Mobile today.",
    },
    evening: {
        image: goodEvening,
        gradient: "linear-gradient(120deg, #F1ECFF 0%, #E1D5FF 50%, #D3C2FF 100%)",
        accent: "#6D42C1",
        subtitle: "Wrap up your day and celebrate your progress.",
    },
};

const GreetingBanner = ({ fullName, getDayGreetings }) => {
    const greeting = getDayGreetings()?.toLowerCase()?.trim();
    const period = greeting.includes("afternoon")
        ? "afternoon"
        : greeting.includes("evening") || greeting.includes("night")
            ? "evening"
            : "morning";

    // const config = greetingConfig[period];
    const config = greetingConfig[period];
    return (
        <section
            className="greeting-banner"
            style={{
                background: config.gradient,
                "--greeting-accent": config.accent,
            }}
        >
            <div className="greeting-banner__content">
                <span className="greeting-banner__eyebrow">
                    YOUR WORKSPACE
                </span>

                <Heading
                    title={`${greeting}, ${fullName} 👋`}
                    subtitle={config.subtitle}
                />

                <div className="greeting-banner__status">
                    <span className="greeting-banner__dot" />
                    Ready to make progress
                </div>
            </div>

            <img
                src={config.image}
                alt={`${period} illustration`}
                className="greeting-banner__image"
            />

            <div className="greeting-banner__decoration" />
        </section>
    )
}

export default GreetingBanner 
