import React, { Suspense, useEffect, useState } from "react";
import Heading from "../../components/custom/Heading";
import ButtonInput from "../../components/form/ButtonInput";
import MenuTab from "../../components/tab/MenuTab";
import {
    UserOutlined,
    EditOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useGetUserByAuthIdQuery } from "../../features/user/api/userApi";
import { useSelector } from "react-redux";

const BasicInfo = React.lazy(() => import("./components/BasicInfo"));
const UpdateUser = React.lazy(() =>
    import("../../features/user/update/UpdateUser")
);

const UserProfile = () => {
    const user = useSelector((state) => state.auth.user);

    const { data: userRes, isLoading } = useGetUserByAuthIdQuery(user.id, {
        skip: !user.id,
    });

    const getActiveTab = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("tab") || "profile";
    };

    const [activeTab, setActiveTab] = useState(getActiveTab);

    useEffect(() => {
        const handlePopState = () => {
            setActiveTab(getActiveTab());
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const changeTab = (tab) => {
        const params = new URLSearchParams(window.location.search);

        params.set("tab", tab);

        window.history.pushState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
        );

        setActiveTab(tab);
    };

    const tabContent = {
        profile: "Your account detail and activity",
        edit: "Update your personal details",
        security: "Manage password and account preferences",
    };

    const onClose = () => {
        changeTab("profile");
    };

    const handleEditProfile = () => {
        changeTab("edit");
    };

    const items = [
        {
            key: "profile",
            label: "Profile",
            icon: <UserOutlined />,
            content: (
                <Suspense fallback={<p>Page is loading...</p>}>
                    <BasicInfo userData={userRes?.data} />
                </Suspense>
            ),
        },
        {
            key: "edit",
            label: "Edit Profile",
            icon: <EditOutlined />,
            content: (
                <Suspense fallback={<p>Page is loading...</p>}>
                    <UpdateUser
                        onClose={onClose}
                        userData={userRes?.data}
                    />
                </Suspense>
            ),
        },
        {
            key: "security",
            label: "Security",
            icon: <LockOutlined />,
            content: <p>This is security</p>,
        },
    ];

    if (isLoading) {
        return <p>Data is loading</p>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <Heading
                    title="My Profile"
                    subtitle={tabContent[activeTab]}
                />

                {activeTab !== "edit" && (
                    <ButtonInput
                        label="Edit Profile"
                        className="btn-base btn-outline"
                        onClick={handleEditProfile}
                    />
                )}
            </div>

            <div>
                <MenuTab
                    items={items}
                    urlParam="tab"
                    activeKey={activeTab}
                    onChange={changeTab}
                />
            </div>
        </div>
    );
};

export default UserProfile;