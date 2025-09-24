import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Dropdown, Tag, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  CalendarOutlined,
  BookOutlined 
} from '@ant-design/icons';

const { Search } = Input;

const SearchAndFilter = ({ 
  onSearch, 
  onFilter, 
  onClear,
  subjects = [],
  loading = false 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const subjectColors = {
    'Lý sinh': 'blue',
    'Sinh học và Di truyền': 'green',
    'Xác suất thống kê': 'orange',
    'Hóa học': 'red',
    'Bóng đá 1': 'purple',
    'Tổng quan ngành Y tế - Pháp luật Y tế': 'cyan',
    'Triết học Mác – Lênin': 'magenta'
  };

  const timeRangeOptions = [
    { key: 'all', label: 'Tất cả thời gian' },
    { key: 'today', label: 'Hôm nay' },
    { key: 'thisWeek', label: 'Tuần này' },
    { key: 'thisMonth', label: 'Tháng này' },
    { key: 'nextWeek', label: 'Tuần tới' }
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch && onSearch(value);
  };

  const handleSubjectToggle = (subject) => {
    const newSelected = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    
    setSelectedSubjects(newSelected);
    onFilter && onFilter({ subjects: newSelected, timeRange: selectedTimeRange });
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    onFilter && onFilter({ subjects: selectedSubjects, timeRange: range });
  };

  const handleClear = () => {
    setSearchValue('');
    setSelectedSubjects([]);
    setSelectedTimeRange('all');
    onClear && onClear();
  };

  const subjectFilterMenu = {
    items: subjects.map(subject => ({
      key: subject,
      label: (
        <div onClick={() => handleSubjectToggle(subject)}>
          <Tag 
            color={selectedSubjects.includes(subject) ? subjectColors[subject] : 'default'}
            style={{ cursor: 'pointer', margin: '2px' }}
          >
            {subject}
          </Tag>
        </div>
      )
    }))
  };

  const timeRangeMenu = {
    items: timeRangeOptions.map(option => ({
      key: option.key,
      label: (
        <div onClick={() => handleTimeRangeChange(option.key)}>
          <span style={{ 
            fontWeight: selectedTimeRange === option.key ? 'bold' : 'normal',
            color: selectedTimeRange === option.key ? '#1890ff' : 'inherit'
          }}>
            {option.label}
          </span>
        </div>
      )
    }))
  };

  const hasFilters = selectedSubjects.length > 0 || selectedTimeRange !== 'all' || searchValue;

  return (
    <div className="search-filter-card" style={{ marginBottom: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Search Bar */}
        <Search
          placeholder="Tìm kiếm môn học, phòng, nội dung..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          style={{ borderRadius: '999px' }}
        />

        {/* Filter Controls */}
        <Space wrap>
          <Dropdown menu={subjectFilterMenu} trigger={['click']} placement="bottomLeft">
            <Button icon={<BookOutlined />} shape="round">
              Môn học {selectedSubjects.length > 0 && `(${selectedSubjects.length})`}
            </Button>
          </Dropdown>

          <Dropdown menu={timeRangeMenu} trigger={['click']} placement="bottomLeft">
            <Button icon={<CalendarOutlined />} shape="round">
              Thời gian
            </Button>
          </Dropdown>

          {hasFilters && (
            <Tooltip title="Xóa tất cả bộ lọc">
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClear}
                shape="round"
              >
                Xóa bộ lọc
              </Button>
            </Tooltip>
          )}
        </Space>

        {/* Active Filters Display */}
        {(selectedSubjects.length > 0 || selectedTimeRange !== 'all') && (
          <div>
            <Space wrap size="small">
              {selectedSubjects.map(subject => (
                <Tag
                  key={subject}
                  color={subjectColors[subject]}
                  closable
                  onClose={() => handleSubjectToggle(subject)}
                  style={{ fontSize: '12px', borderRadius: '999px', padding: '2px 10px' }}
                >
                  {subject}
                </Tag>
              ))}
              {selectedTimeRange !== 'all' && (
                <Tag
                  color="processing"
                  closable
                  onClose={() => handleTimeRangeChange('all')}
                  style={{ fontSize: '12px', borderRadius: '999px', padding: '2px 10px' }}
                >
                  {timeRangeOptions.find(opt => opt.key === selectedTimeRange)?.label}
                </Tag>
              )}
            </Space>
          </div>
        )}
      </Space>
    </div>
  );
};

export default SearchAndFilter;