import React, { useState } from 'react';
import { Calendar, Badge, Card, List, Typography, Space, Tag, Tooltip, Avatar } from 'antd';
import { 
  BookOutlined, 
  ExperimentOutlined, 
  CalculatorOutlined, 
  GlobalOutlined,
  HistoryOutlined,
  BulbOutlined,
  TeamOutlined,
  ToolOutlined,
  DesktopOutlined,
  FileTextOutlined,
  SoundOutlined,
  HeartOutlined,
  FlagOutlined,
  CrownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import EmptyState from './EmptyState';
import { useTheme } from './ThemeProvider';

const { Text, Title } = Typography;

// Mapping subjects to icons and colors
const subjectConfig = {
  'Xác suất thống kê': { icon: <CalculatorOutlined />, color: '#1890ff', bgColor: '#e6f7ff' },
  'Lý sinh': { icon: <ExperimentOutlined />, color: '#faad14', bgColor: '#fffbe6' },
  'Sinh học và Di truyền': { icon: <HeartOutlined />, color: '#13c2c2', bgColor: '#e6fffb' },
  'Văn': { icon: <FileTextOutlined />, color: '#722ed1', bgColor: '#f9f0ff' },
  'Hóa học': { icon: <GlobalOutlined />, color: '#eb2f96', bgColor: '#fff0f6' },
  'Triết học Mác – Lênin': { icon: <HistoryOutlined />, color: '#fa8c16', bgColor: '#fff7e6' },
  'Tổng quan ngành Y tế - Pháp luật Y tế': { icon: <TeamOutlined />, color: '#2f54eb', bgColor: '#f0f5ff' },
};

const ScheduleCalendar = ({ data, selectedDate, onDateSelect }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const { isDarkMode } = useTheme();

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const targetYear = date.year();
    const targetMonth = date.month() + 1; // dayjs months are 0-indexed
    const targetDay = date.date();
    
    return data.filter(course => 
      course.year === targetYear && 
      course.month === targetMonth && 
      course.day === targetDay
    );
  };

  // Get selected date events
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Custom date cell render with icons only
  const dateCellRender = (value) => {
    const events = getEventsForDate(value);
    if (events.length === 0) return null;

    // Group events by subject to avoid duplicates
    const uniqueSubjects = [...new Set(events.map(event => event.subject))];
    const displayCount = Math.min(uniqueSubjects.length, 4); // Max 4 icons per cell
    
    return (
      <div 
        style={{ 
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px'
        }}
      >
        {/* Icons grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: displayCount <= 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gridTemplateRows: displayCount <= 2 ? '1fr' : 'repeat(2, 1fr)',
          gap: '3px',
          width: 'fit-content'
        }}>
          {uniqueSubjects.slice(0, 4).map((subject, index) => {
            const config = subjectConfig[subject] || { 
              icon: <BookOutlined />, 
              color: '#666', 
              bgColor: '#f5f5f5' 
            };
            
            return (
              <Tooltip 
                key={index}
                title={`${subject} (${events.filter(e => e.subject === subject).length} tiết)`}
                placement="top"
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    background: isDarkMode ? config.color : config.bgColor,
                    border: `2px solid ${config.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: isDarkMode ? '#fff' : config.color,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {config.icon}
                </div>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Count badge if more than 4 subjects */}
        {uniqueSubjects.length > 4 && (
          <Badge 
            count={`+${uniqueSubjects.length - 4}`} 
            size="small"
            style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              fontSize: '8px'
            }}
          />
        )}
        
        {/* Total lessons indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '2px',
          fontSize: '9px',
          color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)',
          fontWeight: 'bold',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
          borderRadius: '3px',
          padding: '1px 3px',
          lineHeight: '1'
        }}>
          {events.length}
        </div>
      </div>
    );
  };

  // Calendar change handler
  const handleCalendarChange = (date) => {
    onDateSelect(date);
  };

  // Calendar hover handlers
  const handleMouseEnter = (date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <Card 
        title={
          <Space>
            <BookOutlined />
            <Text strong>Lịch Khóa Biểu</Text>
          </Space>
        }
        style={{
          borderRadius: '12px',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.08)',
          border: isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0'
        }}
        bodyStyle={{ padding: '0' }}
      >
        <Calendar
          value={selectedDate}
          onSelect={handleCalendarChange}
          dateCellRender={dateCellRender}
          locale={{
            lang: {
              locale: 'vi_VN',
              monthFormat: 'M/YYYY',
              yearFormat: 'YYYY',
              monthSelect: 'Chọn tháng',
              yearSelect: 'Chọn năm',
              decadeSelect: 'Chọn thập kỷ',
              today: 'Hôm nay',
              now: 'Bây giờ',
              backToToday: 'Trở về hôm nay',
              ok: 'OK',
              clear: 'Xóa',
              month: 'Tháng',
              year: 'Năm',
              timeSelect: 'Chọn thời gian',
              dateSelect: 'Chọn ngày',
              weekSelect: 'Chọn tuần',
              dateFormat: 'DD/MM/YYYY',
              dayFormat: 'DD',
              dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
              monthBeforeYear: true,
              previousMonth: 'Tháng trước',
              nextMonth: 'Tháng sau',
              previousYear: 'Năm trước',
              nextYear: 'Năm sau',
              previousDecade: 'Thập kỷ trước',
              nextDecade: 'Thập kỷ sau',
              previousCentury: 'Thế kỷ trước',
              nextCentury: 'Thế kỷ sau'
            }
          }}
          style={{
            background: 'transparent'
          }}
          // Custom cell props for better hover effect
          cellRender={(current, info) => {
            if (info.type === 'date') {
              return (
                <div
                  onMouseEnter={() => handleMouseEnter(current)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {dateCellRender(current)}
                </div>
              );
            }
            return info.originNode;
          }}
        />
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card
          title={
            <Space>
              <Text strong style={{ 
                color: isDarkMode ? '#fff' : '#262626',
                fontSize: '18px'
              }}>
                Lịch học ngày {selectedDate.format('DD/MM/YYYY')} 
                ({selectedDate.format('dddd', 'vi')})
              </Text>
              <Tag color="blue" style={{
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                {selectedEvents.length} tiết học
              </Tag>
            </Space>
          }
          style={{
            marginTop: '16px',
            borderRadius: '12px',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 4px 20px rgba(0,0,0,0.08)',
            border: isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0'
          }}
        >
          {selectedEvents.length > 0 ? (
            <List
              dataSource={selectedEvents}
              renderItem={(event, index) => {
                const config = subjectConfig[event.subject] || { 
                  icon: <BookOutlined />, 
                  color: '#666',
                  bgColor: '#f5f5f5'
                };
                
                return (
                  <List.Item
                    style={{
                      padding: '16px 0',
                      borderBottom: index === selectedEvents.length - 1 ? 'none' : 
                        `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`,
                      backgroundColor: isDarkMode ? 'transparent' : '#fafafa',
                      borderRadius: '8px',
                      marginBottom: index === selectedEvents.length - 1 ? 0 : '8px',
                      paddingLeft: '12px',
                      paddingRight: '12px'
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: config.color,
                            color: '#fff'
                          }}
                          icon={config.icon}
                        />
                      }
                      title={
                        <Space>
                          <Text strong style={{ 
                            color: isDarkMode ? '#fff' : '#262626',
                            fontSize: '16px'
                          }}>
                            {event.subject}
                          </Text>
                          <Tag color={config.color} style={{
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {event.periods} tiết
                          </Tag>
                          <Tag color="processing" style={{
                            fontWeight: '500',
                            fontSize: '12px'
                          }}>
                            {event.startTime} - {event.endTime}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={6}>
                          <Text style={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            📍 Phòng: <span style={{ fontWeight: 'bold' }}>{event.room}</span>
                          </Text>
                          <Text style={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            📚 Nhóm: <span style={{ fontWeight: 'bold' }}>{event.group}</span>
                          </Text>
                          <Text style={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            lineHeight: '1.4'
                          }}>
                            📝 Nội dung: <span style={{ fontWeight: '500' }}>{event.content}</span>
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <EmptyState 
              type="no-classes"
              title="Không có lịch học"
              description="Hôm nay bạn không có tiết học nào"
            />
          )}
        </Card>
      )}

      {/* Legend */}
      <Card
        title={
          <Text strong style={{ 
            color: isDarkMode ? '#fff' : '#262626',
            fontSize: '16px'
          }}>
            Chú thích môn học
          </Text>
        }
        size="small"
        style={{
          marginTop: '16px',
          borderRadius: '12px',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.08)',
          border: isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(subjectConfig).map(([subject, config]) => (
            <Space key={subject} size={8}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  background: isDarkMode ? config.color : config.bgColor,
                  border: `2px solid ${config.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: isDarkMode ? '#fff' : config.color
                }}
              >
                {config.icon}
              </div>
              <Text style={{ 
                fontSize: '13px',
                fontWeight: '500',
                color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)'
              }}>
                {subject}
              </Text>
            </Space>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ScheduleCalendar;