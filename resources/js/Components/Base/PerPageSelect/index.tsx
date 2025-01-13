import {FormSelect} from "@/Components/Base/Form";
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

function PerPageSelect({value, onChange}: PerPageSelectProps) {
  const {listPageProps} = usePage<PageProps>().props;

  return (
    <FormSelect
      className="sm:w-20 rounded-[0.5rem]"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {listPageProps.defaultOnPage.map((pagination, key) => (
        <option key={key}
                value={pagination}>
          {pagination}
        </option>
      ))}
    </FormSelect>
  );
}

export default PerPageSelect;
