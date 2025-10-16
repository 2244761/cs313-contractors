import { useBreadcrumb } from "@refinedev/core";
import { Link } from "react-router";

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();
  return (
    <>
      <ul>
        {breadcrumbs.map((breadcrumb) => {
          return (
            <li
              key={`breadcrumb-${breadcrumb.label}`}
              className="text-[var(--primary)] text-3xl font-bold"
            >
              {breadcrumb.href ? (
                <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
              ) : (
                <span>{breadcrumb.label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};
