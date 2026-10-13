import React, { Suspense, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import Heading from '../../../components/custom/Heading';
import ButtonInput from '../../../components/form/ButtonInput';
import AddTicket from '../../../features/ticket/create/AddTicket';
import MenuTab from '../../../components/tab/MenuTab';

const TicketList = React.lazy(() => import("../../ticket-management/TicketList"))
const VALID_TABS = ['board', 'list', 'reports'];

const Board = () => {
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL
  const tabParam = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(tabParam)
    ? tabParam
    : 'board';

  // Update active tab in URL
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

  const items = [
    {
      key: 'board',
      label: 'Board',
      icon: <AppstoreOutlined />,
      content: (
        <Suspense fallback={<p>Loading board...</p>}>
          <div>Ticket board view will appear here.</div>
        </Suspense>
      ),
    },
    {
      key: 'list',
      label: 'List',
      icon: <UnorderedListOutlined />,
      content: (
        <Suspense fallback={<p>Loading tickets...</p>}>
          <TicketList />
        </Suspense>
      ),
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: <BarChartOutlined />,
      content: (
        <Suspense fallback={<p>Loading reports...</p>}>
          <div>Ticket reports will appear here.</div>
        </Suspense>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Heading
          title="Sprint Board"
          subtitle="Sep 15 - Sep 28 - 6 days remaining"
        />

        <ButtonInput
          type="button"
          className="btn-submit"
          label="+ Create ticket"
          onClick={() => setShowAddTicket(true)}
        />
      </div>

      {/* Ticket Views */}
      <MenuTab
        items={items}
        urlParam="tab"
        activeKey={activeTab}
        onChange={changeTab}
      />

      {/* Create Ticket Drawer / Modal */}
      <AddTicket
        open={showAddTicket}
        onClose={() => setShowAddTicket(false)}
      />
    </div>
  );
};

export default Board;