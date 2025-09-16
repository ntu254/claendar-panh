import React from 'react';
import { Empty, Button, Space, Typography } from 'antd';
import { 
  CalendarOutlined, 
  BookOutlined, 
  SearchOutlined,
  ClockCircleOutlined,
  SmileOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const EmptyState = ({ 
  type = 'default', 
  title, 
  description, 
  action, 
  actionText = 'Thử lại',
  onAction 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'no-classes-today':
        return {
          icon: <SmileOutlined style={{ fontSize: '64px', color: '#52c41a' }} />,
          title: title || 'Không có lịch học hôm nay',
          description: description || 'Tuyệt vời! Bạn có thể nghỉ ngơi hoặc tự học.',
          showAction: false
        };
      case 'no-upcoming':
        return {
          icon: <ClockCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />,
          title: title || 'Không có lịch học sắp tới',
          description: description || 'Hãy tận hưởng thời gian rảnh rỗi!',
          showAction: false
        };
      case 'no-search-results':
        return {
          icon: <SearchOutlined style={{ fontSize: '64px', color: '#fa8c16' }} />,
          title: title || 'Không tìm thấy kết quả',
          description: description || 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.',
          showAction: true
        };
      case 'calendar':
        return {
          icon: <CalendarOutlined style={{ fontSize: '64px', color: '#722ed1' }} />,
          title: title || 'Không có lịch học',
          description: description || 'Chưa có dữ liệu lịch học cho ngày này.',
          showAction: false
        };
      case 'error':
        return {
          icon: <BookOutlined style={{ fontSize: '64px', color: '#f5222d' }} />,
          title: title || 'Có lỗi xảy ra',
          description: description || 'Không thể tải dữ liệu lịch học.',
          showAction: true
        };
      default:
        return {
          icon: <BookOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />,
          title: title || 'Không có dữ liệu',
          description: description || 'Chưa có thông tin để hiển thị.',
          showAction: !!action
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ marginBottom: '16px' }}>
        {config.icon}
      </div>
      
      <Space direction="vertical" align="center" size="small">
        <Text strong style={{ fontSize: '16px', color: '#333' }}>
          {config.title}
        </Text>
        
        <Text type="secondary" style={{ fontSize: '14px', maxWidth: '300px' }}>
          {config.description}
        </Text>
        
        {(config.showAction || action) && (
          <div style={{ marginTop: '16px' }}>
            {action || (
              <Button 
                type="primary" 
                onClick={onAction}
                style={{ borderRadius: '6px' }}
              >
                {actionText}
              </Button>
            )}
          </div>
        )}
      </Space>
    </div>
  );
};

export default EmptyState;