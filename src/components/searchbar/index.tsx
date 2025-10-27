import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  return (
    <>
      <div className="md:w-75 lg:w-150 p-2 border flex items-center leading-0 rounded border-[var(--ui-border)] gap-2 ">
        <HiOutlineMagnifyingGlass color={"var(--ui-border)"} />

        <input
          className="w-full outline-none"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </>
  );
};
