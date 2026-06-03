import { useFormContext, useFormState } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const ErrorSummary = () => {
  const { control } = useFormContext();

  const { errors } = useFormState({ control });

  const errorsList = Object.values(errors);

  if (!errorsList.length) return null;

  const errorsCount = errorsList.length || 0;
  console.log(errorsList);

  return (
    <Alert variant="destructive" className="mb-8">
      <AlertCircleIcon />
      <AlertTitle>{errorsCount} خطا وجود دارد!</AlertTitle>
      <AlertDescription>
        {errorsList.map((item, i) => (
          <div key={i}>
            {item?.message?.toString()} <span className="underline cursor-pointer">مشاهده</span>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
};
