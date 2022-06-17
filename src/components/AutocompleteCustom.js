import { Autocomplete, TextField } from "@mui/material";

export const AutocompleteCustom = ({
  disabled,
  options,
  optionLabel,
  onChange,
  label,
  defaultValue,
}) => {
  return (
    <Autocomplete
      autoSelect
      disabled={disabled}
      options={options}
      defaultValue={defaultValue}
      getOptionLabel={(option) => option[optionLabel]}
      onChange={onChange}
      renderInput={(params) => (
        <TextField required {...params} label={label} variant="standard" />
      )}
    />
  );
};
