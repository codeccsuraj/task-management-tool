import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    TeamOutlined,
    BarChartOutlined,
} from "@ant-design/icons";

import { useGetTeamProjectsQuery } from "../../features/ticket/api/ticketApi";

const { Sider } = Layout;

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();
    const navigate = useNavigate();

    const { data: projectRes, isLoading } =
        useGetTeamProjectsQuery();

    const projects = projectRes?.data || [];

    const userGroup = user?.user_group;

    // ------------------------------------
    // Dynamic Project Children
    // ------------------------------------

    const projectChildren = projects.map((project) => ({
        key: `/board/${project.key}`,

        label: project.name,

        icon: (
            <span
                style={{
                    width: 20,
                    height: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    background: "#f0f0f0",
                    color: "#555",
                    fontSize: 10,
                    fontWeight: 600,
                }}
            >
                {project.key?.charAt(0)}
            </span>
        ),
    }));

    // ------------------------------------
    // Menu Items
    // ------------------------------------

    const menuItems = [
        {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Overview",
        },

        {
            key: "/board",
            icon: <AppstoreOutlined />,
            label: "Sprint Board",
            children: isLoading
                ? [
                    {
                        key: "loading",
                        label: "Loading projects...",
                        disabled: true,
                    },
                ]
                : projectChildren.length
                    ? projectChildren
                    : [
                        {
                            key: "no-projects",
                            label: "No projects",
                            disabled: true,
                        },
                    ],
        },


        ...(userGroup === "ADMIN"
            ? [
                {
                    key: "/backlog",
                    icon: <UnorderedListOutlined />,
                    label: "Backlog",
                },
                {
                    key: "/sprints",
                    icon: <AppstoreOutlined />,
                    label: "Sprints",
                },
                {
                    key: "/team",
                    icon: <TeamOutlined />,
                    label: "Team",
                },
                {
                    key: "/reports",
                    icon: <BarChartOutlined />,
                    label: "Reports",
                },
            ]
            : []),
    ];

    // ------------------------------------
    // Find Active Menu
    // ------------------------------------

    const selectedKey =
        projectChildren.find((item) =>
            location.pathname.startsWith(item.key)
        )?.key || location.pathname;

    // ------------------------------------
    // Open Sprint Board automatically
    // ------------------------------------

    const isProjectBoard = location.pathname.startsWith("/board/");

    const defaultOpenKeys = isProjectBoard
        ? ["/board"]
        : [];

    // ------------------------------------
    // Render
    // ------------------------------------

    return (
        <Sider
            width={240}
            theme="dark"
            className="app-sidebar"
        >
            <div className="sidebar-brand">
                <div className="brand-logo">T</div>

                <span className="brand-name">
                    Trackline
                </span>
            </div>

            <div className="sidebar-section-title">
                Workspace
            </div>

            <Menu
                theme="dark"
                mode="inline"
                items={menuItems}
                selectedKeys={[selectedKey]}
                defaultOpenKeys={defaultOpenKeys}
                onClick={({ key }) => navigate(key)}
            />

            <div className="sidebar-user">
                <div className="user-avatar">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div className="user-info">
                    <span className="user-name">
                        {user?.full_name || "User"}
                    </span>

                    <span className="user-role">
                        {user?.role || "Developer"}
                    </span>
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar;