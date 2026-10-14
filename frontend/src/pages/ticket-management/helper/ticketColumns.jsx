import { Link } from "react-router-dom"

export const getTicketListColumns = () => {
    return [
        {
            title: 'TICKET',
            dataIndex: "ticketId",
            key: 'ticketId',
            width: 330,
            render: (val) => (
                <Link
                    to={`/ticket/${val}`}
                    className="link"
                >
                    {val}
                </Link>
            )
        },
        {
            title: 'TITLE',
            dataIndex: "title",
            key: 'title',
            width: 330,
            render: (val, record) => (
                <Link to={`/ticket/${record?.ticketId}`} className="link">{val}</Link>
            )
        },
        {
            title: 'TYPE',
            dataIndex: "type",
            key: 'type',
            className: "text-capitalize",
            width: 330,
        },
        {
            title: 'STATUS',
            dataIndex: "status",
            key: 'status',
            className: "text-uppercase",
            width: 330,
        },
        {
            title: 'PRIORITY',
            dataIndex: "priority",
            key: 'priority',
            className: "text-capitalize",
            width: 330,
        },
        {
            title: 'ASSIGNED PERSON',
            dataIndex: ["assigned", "user", "full_name"],
            key: 'assigned',
            className: "text-capitalize",
            width: 330,
        },
    ]
}