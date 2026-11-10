import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetUserByAuthIdQuery, useGetUsersQuery } from "../../features/user/api/userApi";
import { getDayGreetings } from "../../hook/generator";
import GreetingBanner from "./GreetingBanner ";
import { Card, Col, Row, Statistic, Progress } from 'antd';
import {
    ProjectOutlined,
    BugOutlined,
    TeamOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useGetMyProjectsQuery } from "../../features/ticket/api/ticketApi";

const Home = () => {
    const authUser = useSelector((state) => state?.auth?.user);
    const { data: memberRes, } = useGetUsersQuery({ page: 1, limit: 10, });
    const { data: projectRes } = useGetMyProjectsQuery({ page: 1, limit: 100, });
    const authId = authUser?.id;
    const isAdmin = authUser?.user_group === "ADMIN";
    const {
        data: userRes,
    } = useGetUserByAuthIdQuery(authId, {
        skip: !authId,
    });
    console.log("object", userRes)

    const totalOpenTickets = useMemo(() => {
        const tickets = userRes?.data?.tickets || [];

        return tickets
            .filter(item => item.status !== 'done')
            .reduce((total, item) => total + item.count, 0);
    }, [userRes?.data?.tickets]);

    const userData = userRes?.data;
    const fullName = userData?.full_name || "User";

    const stats = [
        {
            title: 'Total Projects',
            value: projectRes?.data?.pagination?.totalRecords || 0,
            description: 'Active projects',
            icon: <ProjectOutlined />,
            color: '#6366f1',
            bg: '#eef2ff',
        },
        {
            title: 'Open Tickets',
            value: totalOpenTickets || 0,
            description: 'Need your attention',
            icon: <BugOutlined />,
            color: '#f59e0b',
            bg: '#fffbeb',
        },
        {
            title: 'Team Members',
            value: memberRes?.data?.pagination?.totalRecords || 0,
            description: 'Active members',
            icon: <TeamOutlined />,
            color: '#0ea5e9',
            bg: '#f0f9ff',
        },
        {
            title: 'Completed',
            value: 0,
            suffix: '%',
            description: `${0} of ${2} tickets completed`,
            icon: <CheckCircleOutlined />,
            color: '#10b981',
            bg: '#ecfdf5',
            progress: 0,
        },
    ];

    return (
        <div className="home-page">
            <GreetingBanner fullName={fullName} getDayGreetings={getDayGreetings} />
            {/* Dashboard content */}
            <Row gutter={[16, 16]} className="mt-2">
                {stats.map((item) => (
                    <Col xs={24} sm={12} xl={6} key={item.title}>
                        <Card
                            variant="borderless"
                            className="dashboard-stat-card h-100"
                            styles={{
                                body: {
                                    padding: '18px 20px',
                                },
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-start">

                                <div className="flex-grow-1">
                                    <div className="text-secondary fw-semibold small mb-2">
                                        {item.title}
                                    </div>

                                    <Statistic
                                        value={item.value}
                                        suffix={item.suffix}
                                        valueStyle={{
                                            fontSize: 27,
                                            fontWeight: 650,
                                            color: '#1f2937',
                                            lineHeight: 1.2,
                                        }}
                                    />
                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{
                                        width: 42,
                                        height: 42,
                                        background: item.bg,
                                        color: item.color,
                                        fontSize: 19,
                                    }}
                                >
                                    {item.icon}
                                </div>
                            </div>

                            {item.progress !== undefined && (
                                <Progress
                                    percent={item.progress}
                                    showInfo={false}
                                    strokeColor={item.color}
                                    trailColor="#f1f5f9"
                                    size="small"
                                    className="mt-2 mb-0"
                                />
                            )}

                            <div className="text-secondary mt-2" style={{ fontSize: 12 }}>
                                {item.description}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Home;