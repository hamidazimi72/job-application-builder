import { useController, UseControllerProps } from "react-hook-form";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

interface OptionsType {
  label: string;
  value: any;
  [key: string]: any;
}

interface PrimaryComboboxType extends UseControllerProps {
  items: OptionsType[];
  placeholder: string;
}
export const PrimaryCombobox = (props: PrimaryComboboxType) => {
  const { field, fieldState } = useController(props);

  return (
    <Field className="">
      <FieldLabel htmlFor={`fi-${props.name}`}>{props.placeholder}</FieldLabel>
      <Combobox
        id={`fi-${props.name}`}
        items={props?.items}
        onValueChange={field.onChange}
        // itemToStringValue={(item: OptionsType) => item?.value}
        {...field}
      >
        <ComboboxInput placeholder={props.placeholder} area-invalid={fieldState.error} />
        <ComboboxContent>
          <ComboboxEmpty>{props.placeholder}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
};
