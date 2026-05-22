import { Box, Typography, Container, Link, Divider } from '@mui/material';

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
              Expense Enterprise Application
            </Typography>
            
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="#" color="text.secondary" underline="hover">About</Link>
            <Link href="#" color="text.secondary" underline="hover">Features</Link>
            <Link href="#" color="text.secondary" underline="hover">Security</Link>
            <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
            <Link href="#" color="text.secondary" underline="hover">Support</Link>
          </Box>

          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Enterprise Inc. All rights reserved.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Privacy Policy
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Terms of Service
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};