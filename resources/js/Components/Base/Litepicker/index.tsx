import "/resources/css/vendors/litepicker.css";
import { createRef, useEffect, useRef } from "react";
import { init, reInit } from "./litepicker";
import LitepickerJs from "litepicker";
import { ILPConfiguration } from "litepicker/dist/types/interfaces";
import { FormInput } from "@/Components/Base/Form";

export interface LitepickerElement extends HTMLInputElement {
  litePickerInstance: LitepickerJs;
}

type LitepickerConfig = Partial<ILPConfiguration>;

export interface LitepickerProps
  extends React.PropsWithChildren,
    Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> {
  options?: {
    format?: string | undefined;
  } & LitepickerConfig;
  onChange?: (e: { target: { value: string } }) => void;
  value?: string;
  getRef?: (el: LitepickerElement) => void;
}

function Litepicker({
                      name,
                      options = {},
                      value = "",
                      onChange = () => {},
                      getRef = () => {},
                      ...computedProps
                    }: LitepickerProps) {
  const initialRender = useRef(true);
  const litepickerRef = createRef<LitepickerElement>();
  const tempValue = useRef(value);

  useEffect(() => {
    if (litepickerRef.current) {
      getRef(litepickerRef.current);
    }

    if (initialRender.current) {
      if (litepickerRef.current !== null) {
        init(litepickerRef.current, { options, value, onChange });
      }
      initialRender.current = false;
    } else {
      if (tempValue.current !== value && litepickerRef.current !== null) {
        reInit(litepickerRef.current, { options, value, onChange });
      }
    }

    tempValue.current = value;
  }, [value]);

  return (
    <FormInput
      ref={litepickerRef}
      name={name}
      type="text"
      autoComplete="off"
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
      }}
      {...computedProps}
    />
  );
}

export default Litepicker;
