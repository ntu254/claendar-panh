import React from 'react';
import { Card, Tag, Space, Typography, Divider, Tooltip, Avatar } from 'antd';
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  BookOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const CourseCard = ({ course, showDate = false }) => {
  // Get subject color and icon
  const getSubjectInfo = (subject) => {
    const subjectMap = {
      'Lý sinh': { 
        color: 'blue', 
        icon: '⚛️',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      'Sinh học và Di truyền': { 
        color: 'green', 
        icon: '🧬',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      'Xác suất thống kê': { 
        color: 'orange', 
        icon: '📊',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      'Hóa học': { 
        color: 'red', 
        icon: '🧪',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      'Bóng đá 1': { 
        color: 'purple', 
        icon: '⚽',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      },
      'Tổng quan ngành Y tế - Pháp luật Y tế': { 
        color: 'cyan', 
        icon: '⚕️',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      },
      'Triết học Mác – Lênin': { 
        color: 'magenta', 
        icon: '📚',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      }
    };
    return subjectMap[subject] || { 
      color: 'default', 
      icon: '📖',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    };
  };

  const subjectInfo = getSubjectInfo(course.subject);
  const courseDate = dayjs(`${course.year}-${course.month}-${course.day}`);
  const isToday = courseDate.isSame(dayjs(), 'day');
  const isPast = courseDate.isBefore(dayjs(), 'day');
  const duration = dayjs(`2023-01-01 ${course.endTime}`).diff(dayjs(`2023-01-01 ${course.startTime}`), 'minute');

  return (
    <Card
      hoverable
      className="course-card"
      style={{
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        border: isToday ? '2px solid #52c41a' : '1px solid #f0f0f0',
        opacity: isPast ? 0.85 : 1,
        background: isToday ? '#f6ffed' : subjectInfo.gradient,
        color: '#1f1f1f',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ padding: '16px', background: 'rgba(255,255,255,0.85)', borderRadius: '12px' }}
    >
      {/* Header with subject and date */}
      <div style={{ marginBottom: '12px' }}>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space align="center">
            <Avatar 
              style={{ 
                background: subjectInfo.gradient,
                border: 'none',
                fontSize: '16px'
              }}
              size="small"
            >
              {subjectInfo.icon}
            </Avatar>
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                {course.subject}
              </Title>
              {showDate && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {courseDate.format('DD/MM/YYYY')}
                </Text>
              )}
            </div>
          </Space>
          {isToday && (
            <Tag color="success" icon={<FireOutlined />} style={{ fontSize: '11px' }}>
              Hôm nay
            </Tag>
          )}
        </Space>
      </div>

      {/* Time and Duration */}
      <Space style={{ width: '100%', marginBottom: '12px' }} size="middle">
        <Tooltip title="Thời gian học">
          <Space size="small">
            <ClockCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ fontSize: '14px' }}>
              {course.startTime} - {course.endTime}
            </Text>
          </Space>
        </Tooltip>
        <Tag color="blue" style={{ fontSize: '11px' }}>
          {Math.floor(duration / 60)}h {duration % 60}m
        </Tag>
      </Space>

      {/* Location and Group */}
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <EnvironmentOutlined style={{ color: '#52c41a' }} />
          <Text style={{ fontSize: '13px' }}>
            <Text strong>Phòng:</Text> {course.room}
          </Text>
        </Space>
        
        <Space>
          <TeamOutlined style={{ color: '#fa8c16' }} />
          <Text style={{ fontSize: '13px' }}>
            <Text strong>Nhóm:</Text> {course.group}
          </Text>
        </Space>
        
        <Space>
          <BookOutlined style={{ color: '#722ed1' }} />
          <Text style={{ fontSize: '13px' }}>
            <Text strong>Số tiết:</Text> {course.periods}
          </Text>
        </Space>
      </Space>

      <Divider style={{ margin: '12px 0' }} />

      {/* Content */}
      <div style={{ marginBottom: '8px' }}>
        <Text style={{ 
          fontSize: '13px', 
          color: '#666',
          lineHeight: '1.5',
          display: 'block'
        }}>
          <Text strong style={{ color: '#333', marginBottom: '4px', display: 'block' }}>
            Nội dung:
          </Text>
          {course.content}
        </Text>
      </div>

      {/* Type badge */}
      <div style={{ marginTop: '8px' }}>
        <Tag 
          color={course.type === 'special' ? 'warning' : 'default'} 
          style={{ fontSize: '11px' }}
        >
          {course.type === 'special' ? 'Hoạt động đặc biệt' : 'Lớp học'}
        </Tag>
      </div>
    </Card>
  );
};

export default CourseCard;