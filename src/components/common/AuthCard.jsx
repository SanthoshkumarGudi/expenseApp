import { Card, CardContent } from '@mui/material';

export const AuthCard = ({ children }) => {
  return (
    <Card sx={{ maxWidth: 420, mx: 'auto', boxShadow: 6, borderRadius: 4 , color: 'text.primary'}}>
      <CardContent sx={{ p: 4 }}>{children}</CardContent>
    </Card>
  );
};