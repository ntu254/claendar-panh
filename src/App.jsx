import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Row, Col, Card, Space, message,
  BackTop, FloatButton, Alert, Tabs, Button
} from 'antd';
import { 
  CalendarOutlined, BookOutlined, ClockCircleOutlined, 
  FireOutlined, SettingOutlined, QuestionCircleOutlined, BgColorsOutlined
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
dayjs.locale('vi');

// Fallback layouts and views that were referenced but not defined
const SkeletonLoaderLayout = ({ isDarkMode }) => (
  <Layout style={{ background: isDarkMode ? '#000' : '#f5f5f5', minHeight: '100vh' }}>
    <Header className="animated-header" style={{
      background: isDarkMode
        ? 'linear-gradient(135deg,#2c3e50,#34495e)'
        : 'linear-gradient(135deg,#667eea,#764ba2)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px'
    }}>
      <Space align="center" className="mobile-stack">
        <CalendarOutlined style={{ fontSize: 26, color: 'white' }} />
        <div>
          <Title level={2} style={{ color: 'white', margin: 0 }}>Lịch Khóa Biểu</Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Đang tải dữ liệu...
          </Typography.Text>
        </div>
      </Space>
    </Header>
    <Content style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <SkeletonLoader type="statistic" count={3} />
        <SkeletonLoader type="calendar" count={1} />
        <SkeletonLoader type="card" count={3} />
      </Space>
    </Content>
  </Layout>
);

const ErrorLayout = ({ isDarkMode, error }) => (
  <Layout style={{ background: isDarkMode ? '#000' : '#f5f5f5', minHeight: '100vh' }}>
    <Header className="animated-header" style={{
      background: isDarkMode
        ? 'linear-gradient(135deg,#2c3e50,#34495e)'
        : 'linear-gradient(135deg,#667eea,#764ba2)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px'
    }}>
      <Space align="center" className="mobile-stack">
        <CalendarOutlined style={{ fontSize: 26, color: 'white' }} />
        <div>
          <Title level={2} style={{ color: 'white', margin: 0 }}>Lịch Khóa Biểu</Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Có lỗi xảy ra khi tải dữ liệu
          </Typography.Text>
        </div>
      </Space>
    </Header>
    <Content style={{ padding: '24px' }}>
      <Alert
        message="Không thể tải dữ liệu lịch học"
        description={String(error)}
        type="error"
        showIcon
      />
    </Content>
  </Layout>
);

// Stats cards
const StatsCards = ({ stats }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Space>
          <BookOutlined style={{ color: '#722ed1' }} />
          <Typography.Text strong>Môn học</Typography.Text>
        </Space>
        <Title level={3} style={{ marginTop: 8 }}>{stats.uniqueSubjects}</Title>
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Space>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <Typography.Text strong>Tổng buổi</Typography.Text>
        </Space>
        <Title level={3} style={{ marginTop: 8 }}>{stats.totalClasses}</Title>
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Space>
          <FireOutlined style={{ color: '#52c41a' }} />
          <Typography.Text strong>Hôm nay</Typography.Text>
        </Space>
        <Title level={3} style={{ marginTop: 8 }}>{stats.todayClasses}</Title>
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Space>
          <ClockCircleOutlined style={{ color: '#fa8c16' }} />
          <Typography.Text strong>Tuần này</Typography.Text>
        </Space>
        <Title level={3} style={{ marginTop: 8 }}>{stats.thisWeekClasses}</Title>
      </Card>
    </Col>
  </Row>
);

// Calendar view layout
const CalendarView = ({
  filteredData,
  selectedDate,
  onDateSelect,
  todayCourses,
  upcomingCourses,
  searchLoading,
  mainGutter
}) => (
  <Row gutter={mainGutter}>
    <Col xs={24} lg={16}>
      {searchLoading ? (
        <SkeletonLoader type="calendar" count={1} />
      ) : (
        <ScheduleCalendar
          data={filteredData}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      )}
    </Col>
    <Col xs={24} lg={8}>
      <Card title="Hôm nay">
        {searchLoading ? (
          <SkeletonLoader type="card" count={2} />
        ) : todayCourses.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {todayCourses.map((c, idx) => <CourseCard key={idx} course={c} />)}
          </Space>
        ) : (
          <EmptyState type="no-classes-today" />
        )}
      </Card>
      <Card title="Sắp tới" style={{ marginTop: 16 }}>
        {searchLoading ? (
          <SkeletonLoader type="card" count={2} />
        ) : upcomingCourses.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {upcomingCourses.map((c, idx) => <CourseCard key={idx} course={c} showDate />)}
          </Space>
        ) : (
          <EmptyState type="no-upcoming" />
        )}
      </Card>
    </Col>
  </Row>
);

// List view
const ListView = ({ sortedCourses }) => (
  <div>
    {sortedCourses.length > 0 ? (
      <Row gutter={[16, 16]}>
        {sortedCourses.map((c, idx) => (
          <Col xs={24} md={12} key={idx}>
            <CourseCard course={c} showDate />
          </Col>
        ))}
      </Row>
    ) : (
      <EmptyState type="no-search-results" />
    )}
  </div>
);

function App() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState('calendar');
  const { isDarkMode } = useTheme();
  const mainGutter = [24, 24];

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleSearch = (searchValue) => {
    setSearchLoading(true);
    setTimeout(() => {
      if (!searchValue) setFilteredData(scheduleData);
      else {
        const filtered = scheduleData.filter(course =>
          course.subject.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.room.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.content.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.group.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        filtered.length === 0
          ? message.info('Không tìm thấy kết quả phù hợp')
          : message.success(`Tìm thấy ${filtered.length} kết quả`);
      }
      setSearchLoading(false);
    }, 300);
  };

  const handleFilter = ({ subjects, timeRange }) => {
    setSearchLoading(true);
    setTimeout(() => {
      let filtered = [...scheduleData];
      if (subjects?.length > 0)
        filtered = filtered.filter(c => subjects.includes(c.subject));
      if (timeRange && timeRange !== 'all') {
        const now = dayjs();
        filtered = filtered.filter(c => {
          const d = dayjs(`${c.year}-${c.month}-${c.day}`);
          switch (timeRange) {
            case 'today': return d.isSame(now, 'day');
            case 'thisWeek': return d.isSame(now, 'week');
            case 'thisMonth': return d.isSame(now, 'month');
            case 'nextWeek': return d.isSame(now.add(1, 'week'), 'week');
            default: return true;
          }
        });
      }
      setFilteredData(filtered);
      message.success(`Hiển thị ${filtered.length} kết quả`);
      setSearchLoading(false);
    }, 200);
  };

  const handleClearFilters = () => {
    setFilteredData(scheduleData);
    message.info('Đã xóa tất cả bộ lọc');
  };

  const todayCourses = filteredData.filter(c =>
    dayjs(`${c.year}-${c.month}-${c.day}`).isSame(dayjs(), 'day')
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingCourses = filteredData.filter(c => {
    const d = dayjs(`${c.year}-${c.month}-${c.day}`);
    return d.isAfter(dayjs(), 'day') && d.isBefore(dayjs().add(7, 'days'), 'day');
  }).sort((a, b) => dayjs(`${a.year}-${a.month}-${a.day} ${a.startTime}`).diff(dayjs(`${b.year}-${b.month}-${b.day} ${b.startTime}`)))
    .slice(0, 5);

  const stats = {
    uniqueSubjects: new Set(scheduleData.map(c => c.subject)).size,
    totalClasses: scheduleData.length,
    todayClasses: todayCourses.length,
    thisWeekClasses: scheduleData.filter(c => dayjs(`${c.year}-${c.month}-${c.day}`).isSame(dayjs(), 'week')).length
  };

  const uniqueSubjects = [...new Set(scheduleData.map(c => c.subject))];
  const sortedCourses = [...filteredData].sort((a, b) => 
    dayjs(`${a.year}-${a.month}-${a.day} ${a.startTime}`).diff(dayjs(`${b.year}-${b.month}-${b.day} ${b.startTime}`))
  );

  if (loading) return <SkeletonLoaderLayout isDarkMode={isDarkMode} />;
  if (error) return <ErrorLayout isDarkMode={isDarkMode} error={error} />;

  return (
    <Layout style={{ background: isDarkMode ? '#000' : '#f5f5f5', minHeight: '100vh' }}>
      <Header className="animated-header" style={{
        background: isDarkMode
          ? 'linear-gradient(135deg,#2c3e50,#34495e)'
          : 'linear-gradient(135deg,#667eea,#764ba2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px'
      }}>
        <Space align="center" className="mobile-stack">
          <CalendarOutlined style={{ fontSize: 26, color: 'white' }} />
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>Lịch Khóa Biểu</Title>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              Đẹp, dễ hiểu và phản hồi tốt trên mọi thiết bị
            </Typography.Text>
          </div>
        </Space>

        <FloatButton
          icon={<BgColorsOutlined />}
          onClick={() => setThemeSettingsOpen(true)}
          style={{ position: 'static', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
          tooltip="Tùy chỉnh giao diện"
        />
      </Header>

      <Content style={{ padding: '24px' }}>
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          onClear={handleClearFilters}
          subjects={uniqueSubjects}
          loading={searchLoading}
        />

        <StatsCards stats={stats} />

        <Tabs
          activeKey={viewMode}
          onChange={setViewMode}
          items={[
            { key: 'calendar', label: 'Xem theo Lịch' },
            { key: 'list', label: 'Xem theo Danh sách' }
          ]}
        />

        {viewMode === 'calendar' ? (
          <CalendarView
            filteredData={filteredData}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            todayCourses={todayCourses}
            upcomingCourses={upcomingCourses}
            searchLoading={searchLoading}
            mainGutter={mainGutter}
          />
        ) : (
          <ListView sortedCourses={sortedCourses} />
        )}
      </Content>

      {/* Mobile bottom nav */}
      <div className="mobile-bottom-nav">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            type={viewMode === 'calendar' ? 'primary' : 'default'}
            shape="round"
            icon={<CalendarOutlined />}
            onClick={() => setViewMode('calendar')}
          >
            Lịch
          </Button>
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            shape="round"
            icon={<BookOutlined />}
            onClick={() => setViewMode('list')}
          >
            Danh sách
          </Button>
        </Space>
      </div>

      <FloatButton.Group trigger="hover" type="primary" style={{ right: 24 }} icon={<SettingOutlined />}>
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

      <BackTop style={{ right: 24, bottom: 24 }} />

      <ThemeSettings open={themeSettingsOpen} onClose={() => setThemeSettingsOpen(false)} />

      <Layout.Footer style={{
        textAlign: 'center',
        background: 'transparent',
        marginTop: 12,
        color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'
      }}>
        Mẹo nhỏ: Dùng bộ lọc để tìm nhanh môn học, hoặc mở Tùy chỉnh giao diện để chọn màu bạn thích.
      </Layout.Footer>
    </Layout>
  );
}

export default App;
