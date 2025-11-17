import {
  Autocomplete,
  MantineProvider,
  Popover,
  ActionIcon,
} from "@mantine/core";

// Icon
import { CiSearch } from "react-icons/ci";

interface SearchProps {
  data: string[];
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  placeholder?: string;
}

export const Search = ({
  data,
  onChange,
  disabled,
  placeholder,
  value,
}: SearchProps) => {
  return (
    <>
      <MantineProvider>
        <Popover>
          <Popover.Target>
            <ActionIcon variant="subtle" color="gray">
              <CiSearch size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Autocomplete
              // leftSection={<CiSearch />}
              placeholder={placeholder}
              data={data}
              onChange={onChange}
              clearable={true}
              disabled={disabled}
              className="border-black"
              value={value}
            />
          </Popover.Dropdown>
        </Popover>
      </MantineProvider>
    </>
  );
};
