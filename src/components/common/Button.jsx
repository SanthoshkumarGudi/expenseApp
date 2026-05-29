import { forwardRef } from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

export const Button = forwardRef((props, ref) => {
  const { children, loading, disabled, ...rest } = props;

  return (
    <MuiButton
      ref={ref}
      variant="contained"
      disabled={loading || disabled}
      
      sx={{
        py: 1.3,
        mt: 1,
        boxShadow: "none",
        transition: "0.25s",
        "&:hover": {
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          transform: "translateY(-1px)",
        },
      }}
      {...rest}
    >
      {loading ? <CircularProgress size={22} color="inherit" justifyContent="center" /> : children}
    </MuiButton>
  );
});