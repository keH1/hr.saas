import { twMerge } from "tailwind-merge";
import { createContext, useContext, useRef, useState, useEffect } from "react";
import Lucide from "@/Components/Base/Lucide";

interface TableProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"table"> {
  dark?: boolean;
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
  sm?: boolean;
}

const tableContext = createContext<{
  dark: TableProps["dark"];
  bordered: TableProps["bordered"];
  hover: TableProps["hover"];
  striped: TableProps["striped"];
  sm: TableProps["sm"];
}>({
  dark: false,
  bordered: false,
  hover: false,
  striped: false,
  sm: false,
});
function Table({
  className,
  dark,
  bordered,
  hover,
  striped,
  sm,
  ...props
}: TableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const checkTableOverflow = () => {
    if (tableContainerRef.current && tableRef.current) {
      const isOverflowing =
        tableRef.current.scrollWidth > tableContainerRef.current.clientWidth;
      setShowArrows(isOverflowing);
    }
  };

  useEffect(() => {
    checkTableOverflow(); // Проверка при загрузке компонента
    window.addEventListener("resize", checkTableOverflow); // Проверка при изменении размера окна
    return () => {
      window.removeEventListener("resize", checkTableOverflow); // Очистка обработчика
    };
  }, []);

  return (
    <tableContext.Provider
      value={{
        dark: dark,
        bordered: bordered,
        hover: hover,
        striped: striped,
        sm: sm,
      }}
    >
      <div
        className="relative"
        onMouseEnter={() => checkTableOverflow()}
        onMouseLeave={() => setShowArrows(false)}
      >
        <div className="overflow-x-auto"
             ref={tableContainerRef}>
          <table
            ref={tableRef}
            className={twMerge([
              "w-full text-left whitespace-nowrap",
              dark && "bg-dark text-white dark:bg-black/30",
              className,
            ])}
            {...props}
          >
            {props.children}
          </table>
        </div>
        <div
          className={twMerge([
            "absolute left-0 top-1/2 transform translate-y-1/2 flex items-center justify-center bg-gray-800 text-white cursor-pointer",
            showArrows ? "opacity-75" : "opacity-0",
            "transition-opacity duration-300 ease-in-out rounded-r-full w-14 h-14",
          ])}
          onMouseEnter={scrollLeft}
          onClick={scrollLeft}
        >
          <Lucide
            icon="ChevronLeft"
            className="w-12 h-12"
          />
        </div>
        <div
          className={twMerge([
            "absolute right-0 top-1/2 transform translate-y-1/2 flex items-center justify-center bg-gray-800 text-white cursor-pointer",
            showArrows ? "opacity-75" : "opacity-0",
            "transition-opacity duration-300 ease-in-out rounded-l-full w-14 h-14",
          ])}
          onMouseEnter={scrollRight}
          onClick={scrollRight}
        >
          <Lucide
            icon="ChevronRight"
            className="w-12 h-12"
          />
        </div>
      </div>
    </tableContext.Provider>
  );
}

interface TheadProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"thead"> {
  variant?: "default" | "light" | "dark";
}

const theadContext = createContext<{
  variant: TheadProps["variant"];
}>({
  variant: "default",
});
Table.Thead = ({className, ...props}: TheadProps) => {
  return (
    <theadContext.Provider
      value={{
        variant: props.variant,
      }}
    >
      <thead
        className={twMerge([
          props.variant === "light" && "bg-slate-200/60 dark:bg-slate-200",
          props.variant === "dark" && "bg-dark text-white dark:bg-black/30",
          className,
        ])}
        {...props}
      >
      {props.children}
      </thead>
    </theadContext.Provider>
  );
};

type TbodyProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<"tbody">
>;

Table.Tbody = ({ className, ...props }: TbodyProps) => {
  return <tbody className={className}>{props.children}</tbody>;
};

type TrProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"tr">;

Table.Tr = ({ className, ...props }: TrProps) => {
  const table = useContext(tableContext);
  return (
    <tr
      className={twMerge([
        table.hover &&
          "[&:hover_td]:bg-slate-100 [&:hover_td]:dark:bg-darkmode-300 [&:hover_td]:dark:bg-opacity-50",
        table.striped &&
          "[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50",
        className,
      ])}
      {...props}
    >
      {props.children}
    </tr>
  );
};

type ThProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"th">;

Table.Th = ({ className, ...props }: ThProps) => {
  const table = useContext(tableContext);
  const thead = useContext(theadContext);
  return (
    <th
      className={twMerge([
        "font-medium px-5 py-3 border-b-2 dark:border-darkmode-300",
        thead.variant === "light" && "border-b-0 text-slate-700",
        thead.variant === "dark" && "border-b-0",
        table.dark && "border-slate-600 dark:border-darkmode-300",
        table.bordered && "border-l border-r border-t",
        table.sm && "px-4 py-2",
        className,
      ])}
      {...props}
    >
      {props.children}
    </th>
  );
};

type TdProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"td">;

Table.Td = ({ className, ...props }: TdProps) => {
  const table = useContext(tableContext);
  return (
    <td
      className={twMerge([
        "px-5 py-3 border-b dark:border-darkmode-300",
        table.dark && "border-slate-600 dark:border-darkmode-300",
        table.bordered && "border-l border-r border-t",
        table.sm && "px-4 py-2",
        className,
      ])}
      {...props}
    >
      {props.children}
    </td>
  );
};

export default Table;
