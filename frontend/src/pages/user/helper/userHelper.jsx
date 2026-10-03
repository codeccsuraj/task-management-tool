import { Avatar, Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

export const getUserListColumns = (pagination) => {
    const columns = [
        {
            title: "#",
            key: "index",
            width: 70,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize +
                index +
                1,
        },

        {
            title: "User",
            key: "user",
            render: (_, record) => {
                const name =
                    record?.full_name ||
                    record?.name ||
                    "Unnamed User";

                return (
                    <Space>
                        <Avatar>
                            {name.charAt(0).toUpperCase()}
                        </Avatar>

                        <div>
                            <div className="fw-semibold">
                                {name}
                            </div>

                            <small className="text-muted">
                                ID: {record?._id?.slice(-6)}
                            </small>
                        </div>
                    </Space>
                );
            },
        },

        {
            title: "Email",
            key: "email",
            render: (_, record) =>
                record?.authId?.email || "-",
        },

        {
            title: "Phone",
            key: "phone",
            render: (_, record) =>
                record?.phone || "-",
        },

        {
            title: "Role",
            key: "role",
            render: (_, record) => (
                <Tag>
                    {record?.role ||
                        record?.authId?.role ||
                        "User"}
                </Tag>
            ),
        },

        {
            title: "Action",
            key: "action",
            align: "right",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                    >
                        View
                    </Button>

                    <Button
                        type="text"
                        icon={<EditOutlined />}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return columns;
}