import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRightOutlined } from "@ant-design/icons";

import { useGetUserByAuthIdQuery } from "../../features/user/api/userApi";
import Heading from "../../components/custom/Heading";
import ButtonInput from "../../components/form/ButtonInput";
import { getDayGreetings } from "../../hook/generator";
import AddProject from "../../features/ticket/create/AddProject";
import GreetingBanner from "./GreetingBanner ";

const Home = () => {
    const authUser = useSelector((state) => state?.auth?.user);
    const [showAddForm, setShowAddForm] = useState(false)
    const authId = authUser?.id;
    const isAdmin = authUser?.user_group === "ADMIN";

    const {
        data: userRes,
    } = useGetUserByAuthIdQuery(authId, {
        skip: !authId,
    });

    const userData = userRes?.data;
    const fullName = userData?.full_name || "User";

    return (
        <div className="home-page">
            <GreetingBanner fullName={fullName} getDayGreetings={getDayGreetings} />
            {/* Dashboard content */}
            <div className="row g-3 mt-2">
                {/* Total Projects */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="p-4 bg-white">
                        <div className="fw-bold text-secondary capitalize">
                            Total Projects
                        </div>

                        <div className="h4">
                            12
                        </div>

                        <div className="home-stat-description">
                            Active projects
                        </div>
                    </div>
                </div>

                {/* Open Tickets */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="p-4 bg-white">
                        <div className="fw-bold text-secondary capitalize">
                            Open Tickets
                        </div>

                        <div className="h4">
                            {userData?.tickets?.find(
                                (ticket) => ticket.status === 'todo'
                            )?.count || 0}
                        </div>

                        <div className="home-stat-description">
                            Need your attention
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="p-4 bg-white">
                        <div className="fw-bold text-secondary capitalize">
                            Team Members
                        </div>

                        <div className="h4">
                            08
                        </div>

                        <div className="home-stat-description">
                            Active members
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="p-4 bg-white">
                        <div className="fw-bold text-secondary capitalize">
                            Completed
                        </div>

                        <div className="h4">
                            84%
                        </div>

                        <div className="home-stat-description">
                            Overall progress
                        </div>
                    </div>
                </div>

            </div>

            <AddProject isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
        </div>
    );
};

export default Home;