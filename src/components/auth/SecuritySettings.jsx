import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ChangePassword } from './ChangePassword';
import {TwoFactor }from './TwoFactor';

export const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'password' or '2fa'

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Security Settings
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, borderBottom: '1px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('password')}
          style={{
            padding: '12px 20px',
            fontWeight: activeTab === 'password' ? 'bold' : 'normal',
            borderBottom: activeTab === 'password' ? '3px solid #1976d2' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Change Password
        </button>

        <button
          onClick={() => setActiveTab('2fa')}
          style={{
            padding: '12px 20px',
            fontWeight: activeTab === '2fa' ? 'bold' : 'normal',
            borderBottom: activeTab === '2fa' ? '3px solid #1976d2' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Two-Factor Authentication
        </button>
      </Box>

      {activeTab === 'password' && <ChangePassword />}
      {activeTab === '2fa' && <TwoFactor />}
    </Box>
  );
};