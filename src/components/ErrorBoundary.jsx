import React from 'react';
import { Alert } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optional: log to monitoring service
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <Alert
            message="Ứng dụng gặp lỗi khi hiển thị"
            description={
              <div style={{ fontSize: 13 }}>
                <div>Vui lòng tải lại trang hoặc thử trên trình duyệt khác.</div>
                <div style={{ marginTop: 8 }}>
                  Chi tiết: {String(this.state.error?.message || this.state.error)}
                </div>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;