import React, { Suspense, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommentOutlined, HistoryOutlined } from '@ant-design/icons';
import MenuTab from '../../components/tab/MenuTab';

const TicketHistory = React.lazy(() => import("./components/TicketHistory"))

const VALID_TABS = ['comments', 'history'];

const TicketFooter = ({ ticketId }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tabParam = searchParams.get('tab');
    const activeTab = VALID_TABS.includes(tabParam)
        ? tabParam
        : 'comments';

    const changeTab = useCallback(
        (key) => {
            if (!VALID_TABS.includes(key)) return;

            setSearchParams(
                (prevParams) => {
                    const params = new URLSearchParams(prevParams);
                    params.set('tab', key);
                    return params;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const items = useMemo(
        () => [
            {
                key: 'comments',
                label: 'Comments',
                icon: <CommentOutlined />,
                content: (
                    <Suspense fallback={<p>Loading comments...</p>}>
                        <div>
                            Ticket comments and conversations will appear here.
                        </div>
                    </Suspense>
                ),
            },
            {
                key: 'history',
                label: 'Ticket History',
                icon: <HistoryOutlined />,
                content: (
                    <Suspense fallback={<p>Loading comments...</p>}>
                        <TicketHistory ticketId={ticketId} />
                    </Suspense>
                ),
            },
        ],
        []
    );

    return (
        <div className="ticket-footer">
            <MenuTab
                items={items}
                urlParam="t ab"
                activeKey={activeTab}
                onChange={changeTab}
            />
        </div>
    );
};

export default TicketFooter;