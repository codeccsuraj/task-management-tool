import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
    {
        key: "overview",
        label: "Overview",
        path: "/",
    },
    {
        key: "board",
        label: "Sprint Board",
        path: "/board",
    },
    {
        key: "backlog",
        label: "Backlog",
        path: "/backlog",
    },
    {
        key: "sprints",
        label: "Sprints",
        path: "/sprints",
    },
    {
        key: "team",
        label: "Team",
        path: "/team",
    },
    {
        key: "reports",
        label: "Reports",
        path: "/reports",
    },
];

const Sidebar = () => {
    return (
        <aside className="sidebar bg-dark text-white">

            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    T
                </div>

                <span className="brand-name">
                    Trackline
                </span>
            </div>

            {/* Navigation title */}
            <div className="sidebar-section-title">
                Workspace
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "sidebar-link-active" : ""
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`sidebar-indicator ${isActive
                                            ? "sidebar-indicator-active"
                                            : ""
                                        }`}
                                />

                                <span>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <div className="user-avatar">
                        S
                    </div>

                    <div className="user-info">
                        <span className="user-name">
                            Suraj
                        </span>

                        <span className="user-role">
                            Developer
                        </span>
                    </div>
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;