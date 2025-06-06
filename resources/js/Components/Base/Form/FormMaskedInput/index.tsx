import {IMaskMixinProps, useIMask} from "react-imask";
import {FormInput} from "@/Components/Base/Form";
import {FormInputProps} from "@/Components/Base/Form/FormInput";
import {forwardRef} from "react";

interface FormMaskedInput extends Omit<FormInputProps, 'type' | 'ref' | 'onChange'> {
  maskOptions: IMaskMixinProps<HTMLInputElement>;
}

const FormMaskedInput = forwardRef<HTMLInputElement, FormMaskedInput>(({maskOptions, value, ...props}, ref) => {
  const {onAccept, onComplete, ...restOptions} = maskOptions;
  const {ref: phoneRef} = useIMask<HTMLInputElement>(
    restOptions,
    {onAccept, onComplete}
  );

  return (
    <FormInput
      {...props}
      ref={phoneRef || ref}
      type="text"
      defaultValue={value}
    />
  );
})

export default FormMaskedInput;
