import { useController, UseControllerProps } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

interface PrimaryCheckboxType extends UseControllerProps {
  label: string;
}
export const PrimaryCheckbox = (props: PrimaryCheckboxType) => {
  const { field, fieldState } = useController(props);

  return (
    <Field orientation="horizontal">
      <Checkbox checked={field.value} onCheckedChange={field.onChange} id={`fi-${props.name}`} />
      <FieldLabel htmlFor={`fi-${props.name}`}>{props.label}</FieldLabel>
    </Field>
  );
};
