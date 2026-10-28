import {
    StarOutlined,
    BugOutlined,
    EditOutlined,
    BookOutlined,
    ArrowDownOutlined,
    MinusOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    PlayCircleOutlined,
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
export const ticketStatusOptions = [
    {
        label: 'To Do',
        value: 'todo',
        icon: <ClockCircleOutlined />,
    },
    {
        label: 'In Progress',
        value: 'inProgress',
        icon: <PlayCircleOutlined />,
    },
    {
        label: 'In Review',
        value: 'inReview',
        icon: <EyeOutlined />,
    },
    {
        label: 'Done',
        value: 'done',
        icon: <CheckCircleOutlined />,
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