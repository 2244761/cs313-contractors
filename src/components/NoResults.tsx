import NoResult from "../assets/images/no-results-found.png";

interface NoResultsProps {
  subheading: string;
}

export const NoResults = ({ subheading }: NoResultsProps) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-12">
      <img src={NoResult} alt="No Result Icon" className={"w-50 h-50 mb-4"} />
      <h2 className="font-medium text-[var(--dark-primary)]">
        No results found.
      </h2>
      <h3 className="text-gray-500">{subheading}</h3>
    </div>
  );
};
