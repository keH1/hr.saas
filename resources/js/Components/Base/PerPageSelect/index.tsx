import {FormSelect} from "@/Components/Base/Form";
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {useAppDispatch, useAppSelector} from "@/Stores/hooks";
import {selectPerPage, setPerPage,} from "@/Stores/perPageSlice";

function PerPageSelect() {
  const {listPageProps} = usePage<PageProps>().props;
  const perPage = useAppSelector(selectPerPage);
  const dispatch = useAppDispatch();

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value, 10);
    dispatch(setPerPage(newPerPage));
  };

  return (
    <FormSelect
      className="sm:w-20 rounded-[0.5rem]"
      value={perPage}
      onChange={handlePerPageChange}
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
