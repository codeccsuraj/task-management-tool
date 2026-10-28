import React from 'react';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center bg-white rounded-4 shadow-sm p-4 p-md-5">
                <Result
                    status="404"
                    title="Page Not Found"
                    subTitle="Sorry, the page you are looking for doesn't exist or may have been moved."
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default PageNotFound;