import { forwardRef } from "react";
import { TextField, InputAdornment } from "@mui/material";

export const Input = forwardRef((props, ref) => {
  const { label, error, icon: Icon, id, ...rest } = props;

  return (
    <TextField
      inputRef={ref}
      id={id}
      label={label}
      error={Boolean(error)}
      helperText={error}
      fullWidth
      InputProps={{
        startAdornment: Icon ? (
          <InputAdornment position="start">
            <Icon size={18} />
          </InputAdornment>
        ) : null,
      }}
      {...rest}
    />
  );
});