// ==================== src/components/common/AuthCard.jsx ====================
import { Card, CardContent, Box } from '@mui/material';

export const AuthCard = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      bgcolor: 'grey.50',
      p: { xs: 2, sm: 3 }
    }}>
      <Card 
        elevation={6} 
        sx={{ 
          maxWidth: 440, 
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};