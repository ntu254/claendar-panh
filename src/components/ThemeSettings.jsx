import React, { useState } from 'react';
import { 
  Drawer, 
  Switch, 
  Typography, 
  Space, 
  Divider, 
  Button,
  Row,
  Col,
  Card,
  Tag,
  Tooltip
} from 'antd';
import { 
  BgColorsOutlined, 
  MoonOutlined, 
  SunOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useTheme } from './ThemeProvider';

const { Title, Text } = Typography;

const ThemeSettings = ({ open, onClose }) => {
  const { isDarkMode, primaryColor, toggleTheme, changeColor } = useTheme();

  const colorOptions = [
    { name: 'Blue', value: '#1890ff', desc: 'Classic Ant Design Blue' },
    { name: 'Purple', value: '#722ed1', desc: 'Royal Purple' },
    { name: 'Green', value: '#52c41a', desc: 'Nature Green' },
    { name: 'Orange', value: '#fa8c16', desc: 'Sunset Orange' },
    { name: 'Red', value: '#f5222d', desc: 'Energy Red' },
    { name: 'Pink', value: '#eb2f96', desc: 'Vibrant Pink' },
    { name: 'Cyan', value: '#13c2c2', desc: 'Ocean Cyan' },
    { name: 'Geek Blue', value: '#2f54eb', desc: 'Tech Blue' }
  ];

  return (
    <Drawer
      title={
        <Space>
          <BgColorsOutlined />
          <Text strong>Theme Settings</Text>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
      styles={{
        body: { 
          padding: 0,
          background: isDarkMode ? '#0f0f0f' : '#fafafa'
        }
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* Dark Mode Toggle */}
        <Card 
          size="small" 
          style={{ 
            marginBottom: 16,
            background: isDarkMode ? '#1a1a1a' : '#ffffff'
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                <div>
                  <Text strong>Dark Mode</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">
          <Text strong>Primary Color</Text>
        </Divider>

        {/* Color Options */}
        <Row gutter={[12, 12]}>
          {colorOptions.map((color) => (
            <Col span={12} key={color.value}>
              <Tooltip title={color.desc}>
                <Card
                  size="small"
                  hoverable
                  onClick={() => changeColor(color.value)}
                  style={{
                    border: primaryColor === color.value ? 
                      `2px solid ${color.value}` : 
                      `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`,
                    cursor: 'pointer',
                    background: isDarkMode ? '#1a1a1a' : '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <Space align="center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: color.value,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {primaryColor === color.value && (
                        <CheckOutlined 
                          style={{ 
                            color: '#ffffff', 
                            fontSize: '12px' 
                          }} 
                        />
                      )}
                    </div>
                    <Text strong style={{ fontSize: '14px' }}>
                      {color.name}
                    </Text>
                  </Space>
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* Preview Section */}
        <Title level={5}>Preview</Title>
        <Card 
          size="small"
          style={{ 
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${primaryColor}`
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Sample text in current theme</Text>
            <Button type="primary" size="small">
              Primary Button
            </Button>
            <Tag color={primaryColor}>Sample Tag</Tag>
          </Space>
        </Card>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Theme preferences are saved automatically
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

export default ThemeSettings;