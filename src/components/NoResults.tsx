import NoResult from "../assets/images/no-result-icon.png";

interface NoResultsProps {
  heading: string;
  subheading: string;
}

export const NoResults = ({ heading, subheading }: NoResultsProps) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <img src={NoResult} alt="No Result Icon" />
      <h2 className="font-medium text-[var(--dark-primary)]">{heading}</h2>
      <h3 className="text-gray-500">{subheading}</h3>
    </div>
  );
};
