import {
  ClassNamesConfig,
  default as ReactSelectBase,
  Props as SelectProps,
  StylesConfig,
} from "react-select";
import AsyncSelect, {AsyncProps} from "react-select/async";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import AsyncCreatableSelect, {AsyncCreatableProps} from 'react-select/async-creatable';
import React, {useMemo} from "react";
import "@css/vendors/react-select.css"
import clsx from "clsx";

type SelectComponentType = 'select' | 'async' | 'creatable' | 'async_creatable';

type ReactSelectProps = (SelectProps<any, any, any> | CreatableProps<any, any, any> | AsyncProps<any, any, any> | AsyncCreatableProps<any, any, any>) & {
  hasError?: boolean;
  componentType?: SelectComponentType;
};

export const ReactSelect: React.FC<ReactSelectProps> = (props) => {
  const {
    componentType = 'select',
    hasError = false,
    ...restProps
  } = props;

  // Выбираем компонент по типу
  const SelectComponent = useMemo(() => {
    switch(componentType) {
      case 'async': return AsyncSelect;
      case 'creatable': return CreatableSelect;
      case 'async_creatable': return AsyncCreatableSelect;
      default: return ReactSelectBase;
    }
  }, [componentType]);

  const defaultClasses: ClassNamesConfig = {
    control: (state) => clsx('hover:border-slate-300/60 border-slate-300/60', {
      "ring-4 ring-opacity-20 ring-primary border-opacity-40 border-primary z-10 shadow-none": state.isFocused,
      "!border-danger !md:rounded-l-none": hasError,
    }),
    option: (state) => clsx({
      "bg-color-primary": state.isSelected
    }),
    menu: () => clsx('z-20')
  };

  const defaultStyles: StylesConfig = {
    input: (base: any) => ({
      ...base,
      outline: 'none',
      border: 'none',
      boxShadow: 'none'
    }),
  };

  const mergedClassNames = useMemo<ClassNamesConfig>(() => {
    const result: ClassNamesConfig = {...defaultClasses};

    if (restProps.classNames) {
      const validKeys = Object.keys(restProps.classNames) as Array<keyof ClassNamesConfig>;

      validKeys.forEach((key) => {
        const existing = result[key];
        const newValue = restProps.classNames?.[key];

        if (newValue) {
          result[key] = (state: any) =>
            clsx(
              typeof newValue === 'function' ? newValue(state) : newValue,
              typeof existing === 'function' ? existing(state) : existing
            );
        }
      });
    }

    return result;
  }, [restProps.classNames, defaultClasses]);

  return (
    <SelectComponent
      {...restProps as any}
      classNamePrefix="react-select"
      classNames={mergedClassNames}
      styles={{
        ...defaultStyles,
        ...restProps.styles,
      }}
      noOptionsMessage={() => 'Нет доступных вариантов'}
      formatCreateLabel={(inputValue: string) => (
        `Создать "${inputValue}"`
      )}
    />
  );
};
