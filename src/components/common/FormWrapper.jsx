import { Box, Stack } from '@mui/material';

export const FormWrapper = ({ children, onSubmit }) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={2.2}>{children}</Stack>
    </Box>
  );
};