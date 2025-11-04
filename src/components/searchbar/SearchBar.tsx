import { Autocomplete, MantineProvider } from "@mantine/core";

// Icon
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  data: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchBar = ({
  data,
  onChange,
  disabled,
  placeholder,
}: SearchBarProps) => {
  return (
    <>
      <MantineProvider>
        <Autocomplete
          leftSection={<CiSearch />}
          placeholder={placeholder}
          data={data}
          onChange={onChange}
          clearable={true}
          disabled={disabled}
        />
      </MantineProvider>
    </>
  );
};
