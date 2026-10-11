import {
    StarOutlined,
    BugOutlined,
    EditOutlined,
    BookOutlined,
    ArrowDownOutlined,
    MinusOutlined,
    ArrowUpOutlined,
    AlertOutlined,
} from '@ant-design/icons';

export const ticketTypeOptions = [
    {
        label: 'Feature',
        value: 'feature',
        icon: <StarOutlined />,
    },
    {
        label: 'Bug',
        value: 'bug',
        icon: <BugOutlined />,
    },
    {
        label: 'Changes',
        value: 'change',
        icon: <EditOutlined />,
    },
    {
        label: 'Story',
        value: 'story',
        icon: <BookOutlined />,
    },
];

export const ticketPriorityOptions = [
    {
        value: 'low',
        label: 'Low',
        icon: <ArrowDownOutlined style={{ color: '#52C41A' }} />,
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: <MinusOutlined style={{ color: '#1677FF' }} />,
    },
    {
        value: 'high',
        label: 'High',
        icon: <ArrowUpOutlined style={{ color: '#FA8C16' }} />,
    },
];