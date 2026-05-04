import { forwardRef } from 'react';
import { Button as MuiButton } from '@mui/material';

export const Button = forwardRef((props, ref) => {
  const { children, loading, ...rest } = props;

  return (
    <MuiButton
      ref={ref}
      fullWidth
      variant="contained"
      disabled={loading}
      sx={{ mt: 1, py: 1.5 }}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
});