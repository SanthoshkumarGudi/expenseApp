import { Box, Paper } from '@mui/material';

export const AuthCard = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 72px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        background:
          'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(37,99,235,0.06))',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
          bgcolor: 'background.paper',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};