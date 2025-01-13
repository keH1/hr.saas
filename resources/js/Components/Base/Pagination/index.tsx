import {twMerge} from "tailwind-merge";
import Button from "../Button";
import {Link} from "@inertiajs/react";

type PaginationProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"nav">;

const generalStyles = [
  "transition duration-200 border shadow-sm inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer", // Default
  "dark:focus:ring-slate-700 dark:focus:ring-opacity-50", // Dark mode
  "[&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90", // On hover and not disabled
  "[&:not(button)]:text-center", // Not a button element
];

function Pagination({className, children}: PaginationProps) {
  return (
    <nav className={className}>
      <ul className="flex w-full mr-0 sm:w-auto sm:mr-auto">{children}</ul>
    </nav>
  );
}

interface LinkProps extends React.PropsWithChildren, React.ComponentPropsWithoutRef<"li"> {
  href?: string | null;
  active?: boolean;
}

Pagination.Link = ({className, active, href, children}: LinkProps) => {
  return (
    <li className="flex-1 sm:flex-initial items-center">
      {href ?
        <Link
          as="a"
          href={href}
          className={twMerge([
            generalStyles,
            "min-w-0 sm:min-w-[40px] font-normal flex items-center justify-center text-slate-800 sm:mr-2" +
            " dark:text-slate-300 px-1 sm:px-3",
            active &&
            "rounded-[0.5rem] bg-white font-medium dark:bg-darkmode-400",
            !active && "shadow-none border-transparent",
            className,
          ])}
        >
          {children}
        </Link>
        :
        <Button
          as="a"
          className={twMerge([
            "min-w-0 sm:min-w-[40px] font-normal flex items-center justify-center text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3",
            active &&
            "rounded-[0.5rem] bg-white font-medium dark:bg-darkmode-400",
            !active && "shadow-none border-transparent",
            className,
          ])}
        >
          {children}
        </Button>
      }
    </li>
  );
};

export default Pagination;
