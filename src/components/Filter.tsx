import { ActionIcon, MantineProvider } from "@mantine/core";
import { FaSort } from "react-icons/fa";

interface FilterProps {
  onClick: () => void;
}

export const Filter = ({ onClick }: FilterProps) => {
  return (
    <>
      <MantineProvider>
        <ActionIcon onClick={onClick} variant="subtle" color="gray">
          <FaSort size={18} />
        </ActionIcon>
      </MantineProvider>
    </>
  );
};
