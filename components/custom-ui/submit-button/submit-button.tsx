import { useFormContext, useFormState } from "react-hook-form";

import { Button } from "@/components/ui/button";

export const SubmitButton = () => {
  const { control } = useFormContext();
  const { isDirty, isSubmitting, isValid } = useFormState({ control });

  const isDisabled = isSubmitting || !isDirty;

  return (
    <Button className="mt-4" type="submit" variant="default" disabled={isDisabled}>
      {isSubmitting ? "در حال ارسال" : "ارسال"}
    </Button>
  );
};
