import React from "react";
import {get} from "lodash";
import clsx from "clsx";
import {FormikContextType} from "formik";

interface FormErrorMessageProps {
  fields: string[];
  formik: FormikContextType<any>;
  errors?: any;
  prefix?: string;
  className?: string;
  showAllErrors?: boolean;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
                                                             fields,
                                                             formik,
                                                             errors,
                                                             prefix = "",
                                                             className = "mt-2 text-danger",
                                                             showAllErrors = false,
                                                           }) => {
  // Формируем полные пути для каждого поля
  const fieldPaths = fields.map(field => `${prefix}${field}`);

  if (showAllErrors) {
    const errorMessages = fieldPaths.reduce<string[]>((acc, field) => {
      const error = get(formik.errors, field) ?? get(errors, field);
      if (error && !acc.includes(error)) {
        acc.push(error);
      }
      return acc;
    }, []);

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <div className={clsx(
        'mt-2 text-danger',
        className
      )}>
        {errorMessages.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  }

  const firstErrorField = fieldPaths.find(
    field =>
      (get(formik.touched, field) && get(formik.errors, field)) ||
      get(errors, field)
  );

  if (!firstErrorField) {
    return null;
  }

  const errorMessage =
    get(formik.errors, firstErrorField) ?? get(errors, firstErrorField);

  return <div className={clsx(
    'mt-2 text-danger',
    className
  )}>{errorMessage}</div>;

};

export default FormErrorMessage;
