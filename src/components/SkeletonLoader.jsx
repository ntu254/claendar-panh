import React from 'react';
import { Card, Skeleton, Space } from 'antd';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const CardSkeleton = () => (
    <Card style={{ marginBottom: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Skeleton.Avatar active size="small" />
        <Skeleton active paragraph={{ rows: 2 }} />
        <Space>
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
        </Space>
      </Space>
    </Card>
  );

  const CalendarSkeleton = () => (
    <Card>
      <Skeleton active title paragraph={{ rows: 8 }} />
    </Card>
  );

  const StatisticSkeleton = () => (
    <Card>
      <Skeleton active paragraph={{ rows: 1 }} />
    </Card>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'calendar':
        return <CalendarSkeleton />;
      case 'statistic':
        return <StatisticSkeleton />;
      case 'card':
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;