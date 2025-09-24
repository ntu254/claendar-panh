import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Space, 
  message,
  BackTop,
  FloatButton
} from 'antd';
import { 
  CalendarOutlined, 
  BookOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import ScheduleCalendar from './components/ScheduleCalendar';
import CourseCard from './components/CourseCard';
import SearchAndFilter from './components/SearchAndFilter';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import ThemeSettings from './components/ThemeSettings';
import { useTheme } from './components/ThemeProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

// Set Vietnamese locale
dayjs.locale('vi');

function App() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  const { isDarkMode } = useTheme();

  // Load schedule data with better error handling
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setScheduleData(data);
        setFilteredData(data);
        message.success('Tải dữ liệu lịch học thành công!');
      } catch (err) {
        console.error('Error loading schedule data:', err);
        setError(err.message);
        message.error('Không thể tải dữ liệu lịch học');
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, []);

  // Search functionality
  const handleSearch = async (searchValue) => {
    setSearchLoading(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      if (!searchValue) {
        setFilteredData(scheduleData);
      } else {
        const filtered = scheduleData.filter(course =>
          course.subject.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.room.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.content.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.group.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        
        if (filtered.length === 0) {
          message.info('Không tìm thấy kết quả phù hợp');
        } else {
          message.success(`Tìm thấy ${filtered.length} kết quả`);
        }
      }
      setSearchLoading(false);
    }, 300);
  };

  // Filter functionality
  const handleFilter = ({ subjects, timeRange }) => {
    setSearchLoading(true);
    
    setTimeout(() => {
      let filtered = [...scheduleData];
      
      // Filter by subjects
      if (subjects && subjects.length > 0) {
        filtered = filtered.filter(course => subjects.includes(course.subject));
      }
      
      // Filter by time range
      if (timeRange && timeRange !== 'all') {
        const now = dayjs();
        filtered = filtered.filter(course => {
          const courseDate = dayjs(`${course.year}-${course.month}-${course.day}`);
          
          switch (timeRange) {
            case 'today':
              return courseDate.isSame(now, 'day');
            case 'thisWeek':
              return courseDate.isSame(now, 'week');
            case 'thisMonth':
              return courseDate.isSame(now, 'month');
            case 'nextWeek':
              return courseDate.isSame(now.add(1, 'week'), 'week');
            default:
              return true;
          }
        });
      }
      
      setFilteredData(filtered);
      message.success(`Hiển thị ${filtered.length} kết quả`);
      setSearchLoading(false);
    }, 200);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredData(scheduleData);
    message.info('Đã xóa tất cả bộ lọc');
  };

  // Get today's courses from filtered data
  const getTodayCourses = () => {
    const today = dayjs();
    return filteredData.filter(course => {
      const courseDate = dayjs(`${course.year}-${course.month}-${course.day}`);
      return courseDate.isSame(today, 'day');
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Get upcoming courses from filtered data
  const getUpcomingCourses = () => {
    const today = dayjs();
    const nextWeek = today.add(7, 'days');
    return filteredData.filter(course => {
      const courseDate = dayjs(`${course.year}-${course.month}-${course.day}`);
      return courseDate.isAfter(today, 'day') && courseDate.isBefore(nextWeek, 'day');
    }).sort((a, b) => {
      const dateA = dayjs(`${a.year}-${a.month}-${a.day} ${a.startTime}`);
      const dateB = dayjs(`${b.year}-${b.month}-${b.day} ${b.startTime}`);
      return dateA.diff(dateB);
    }).slice(0, 5);
  };

  // Get statistics
  const getStatistics = () => {
    const uniqueSubjects = new Set(scheduleData.map(course => course.subject)).size;
    const totalClasses = scheduleData.length;
    const todayClasses = getTodayCourses().length;
    const thisWeekClasses = scheduleData.filter(course => {
      const courseDate = dayjs(`${course.year}-${course.month}-${course.day}`);
      return courseDate.isSame(dayjs(), 'week');
    }).length;

    return {
      uniqueSubjects,
      totalClasses,
      todayClasses,
      thisWeekClasses
    };
  };

  // Get unique subjects for filter
  const getUniqueSubjects = () => {
    return [...new Set(scheduleData.map(course => course.subject))];
  };

  if (loading) {
    return (
      <Layout style={{ 
        background: isDarkMode ? '#000000' : '#f5f5f5', 
        minHeight: '100vh' 
      }}>
        <Header style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Space align="center">
            <CalendarOutlined style={{ fontSize: '24px', color: 'white' }} />
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Lịch Khóa Biểu
            </Title>
          </Space>
        </Header>

        <Content style={{ padding: '24px' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {Array.from({ length: 4 }, (_, index) => (
              <Col xs={24} sm={6} key={index}>
                <SkeletonLoader type="statistic" />
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <SkeletonLoader type="calendar" />
            </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <SkeletonLoader type="card" count={2} />
              </Space>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ 
        background: isDarkMode ? '#000000' : '#f5f5f5', 
        minHeight: '100vh' 
      }}>
        <Header style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Space align="center">
            <CalendarOutlined style={{ fontSize: '24px', color: 'white' }} />
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Lịch Khóa Biểu
            </Title>
          </Space>
        </Header>

        <Content style={{ padding: '24px' }}>
          <EmptyState
            type="error"
            description={error}
            actionText="Tải lại"
            onAction={() => window.location.reload()}
          />
        </Content>
      </Layout>
    );
  }

  const todayCourses = getTodayCourses();
  const upcomingCourses = getUpcomingCourses();
  const stats = getStatistics();
  const uniqueSubjects = getUniqueSubjects();

  return (
    <Layout style={{ 
      background: isDarkMode ? '#000000' : '#f5f5f5', 
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <Header style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <Space align="center" className="mobile-stack">
          <CalendarOutlined style={{ fontSize: '26px', color: 'white' }} />
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Lịch Khóa Biểu
            </Title>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              Đẹp, dễ hiểu và phản hồi tốt trên mọi thiết bị
            </Typography.Text>
          </div>
        </Space>
        
        <FloatButton
          icon={<BgColorsOutlined />}
          onClick={() => setThemeSettingsOpen(true)}
          style={{ 
            position: 'static',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          tooltip="Tùy chỉnh giao diện"
        />
      </Header>

        <Content style={{ padding: '24px' }}>
          {/* Hero Banner */}
          <div className="hero-banner content-spacing">
            <div className="hero-content">
              <Title level={3} style={{ margin: 0 }}>
                Chào bạn! Đây là lịch học của bạn.
              </Title>
              <Typography.Text style={{ display: 'block', marginTop: 6 }}>
                Dễ nhìn, đáng yêu, và phản hồi tốt trên mọi thiết bị. Dùng bộ lọc phía dưới để tìm nhanh.
              </Typography.Text>
            </div>
            <div className="hero-art" aria-hidden="true" />
          </div>

          {/* Search and Filter */}
          <div className="content-spacing">
            <SearchAndFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              onClear={handleClearFilters}
              subjects={uniqueSubjects}
              loading={searchLoading}
            />
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="content-spacing">
            <Col xs={24} sm={6}>
              <Card hoverable className="statistic-card">
                <Statistic
                  title="Môn học"
                  value={stats.uniqueSubjects}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable className="statistic-card">
                <Statistic
                  title="Tổng buổi học"
                  value={stats.totalClasses}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable className="statistic-card">
                <Statistic
                  title="Hôm nay"
                  value={stats.todayClasses}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable className="statistic-card">
                <Statistic
                  title="Tuần này"
                  value={stats.thisWeekClasses}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* Main Calendar */}
            <Col xs={24} lg={16}>
              <ScheduleCalendar 
                data={filteredData} 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </Col>

            {/* Sidebar with today's and upcoming courses */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Today's Courses */}
                <Card
                  className="glass-card"
                  title={
                    <Space>
                      <FireOutlined style={{ color: '#52c41a' }} />
                      <Title level={4} style={{ margin: 0 }}>
                        Hôm nay ({dayjs().format('DD/MM/YYYY')})
                      </Title>
                    </Space>
                  }
                  style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  loading={searchLoading}
                >
                  {todayCourses.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      {todayCourses.map((course, index) => (
                        <CourseCard key={index} course={course} />
                      ))}
                    </Space>
                  ) : (
                    <EmptyState
                      type="no-classes-today"
                    />
                  )}
                </Card>

                {/* Upcoming Courses */}
                <Card
                  className="glass-card"
                  title={
                    <Space>
                      <ClockCircleOutlined style={{ color: '#1890ff' }} />
                      <Title level={4} style={{ margin: 0 }}>
                        Sắp tới
                      </Title>
                    </Space>
                  }
                  style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  loading={searchLoading}
                >
                  {upcomingCourses.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      {upcomingCourses.map((course, index) => (
                        <CourseCard key={index} course={course} showDate={true} />
                      ))}
                    </Space>
                  ) : (
                    <EmptyState
                      type="no-upcoming"
                    />
                  )}
                </Card>
              </Space>
            </Col>
          </Row>
        </Content>

        {/* Float Buttons for additional features */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<SettingOutlined />}
        >
          <FloatButton 
            icon={<QuestionCircleOutlined />} 
            tooltip="Hướng dẫn sử dụng"
            onClick={() => message.info('Tính năng hướng dẫn sẽ có trong phiên bản tiếp theo')}
          />
          <FloatButton 
            icon={<CalendarOutlined />} 
            tooltip="Xuất lịch"
            onClick={() => message.info('Tính năng xuất lịch sẽ có trong phiên bản tiếp theo')}
          />
        </FloatButton.Group>

        {/* Back to top */}
        <BackTop style={{ right: 24, bottom: 24 }} />
        
        {/* Theme Settings */}
        <ThemeSettings 
          open={themeSettingsOpen}
          onClose={() => setThemeSettingsOpen(false)}
        />
      </Layout>
      <Layout.Footer style={{ 
        textAlign: 'center', 
        background: 'transparent', 
        marginTop: 12,
        color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'
      }}>
        Mẹo nhỏ: Dùng bộ lọc để tìm nhanh môn học, hoặc mở Tùy chỉnh giao diện để chọn màu bạn thích.
      </Layout.Footer>
  );
}

export default App
