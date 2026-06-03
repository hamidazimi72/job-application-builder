"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { PrimaryCombobox } from "@/components/custom-ui/primary-combobox/primary-combobox";
import { Input } from "@/components/ui/input";
import { PrimaryCheckbox } from "@/components/custom-ui/primary-checkbox/primary-checkbox";

export const ProfessionalStatus = () => {
  const { register, control } = useFormContext();
  const currentStatus = useWatch({ control, name: "currentStatus" });

  const jobOptions: { label: string; value: "unemployed" | "freelancer" | "employed" | "student" }[] = [
    { label: "دانشجو", value: "student" },
    { label: "کارمند", value: "employed" },
    { label: "فریلنسر", value: "freelancer" },
    { label: "بیکار", value: "unemployed" },
  ];

  const remoteOptions: { label: string; value: string }[] = [
    { label: "بلی", value: "true" },
    { label: "خیر", value: "false" },
  ];

  return (
    <FieldGroup className="grid grid-cols-2 gap-4 mt-4">
      <PrimaryCombobox items={jobOptions} name="currentStatus" placeholder="وضعیت شغلی" control={control} />
      <span className="col-span-1" />

      {currentStatus?.value === "employed" && (
        <>
          <Field className="col-span-1">
            <FieldLabel htmlFor="fi-currentCompany">نام شرکت</FieldLabel>
            <Input {...register("currentCompany")} id="fi-currentCompany" />
          </Field>
          <Field className="col-span-1">
            <FieldLabel htmlFor="fi-yearsOfExperience">سابقه فعالیت</FieldLabel>
            <Input {...register("yearsOfExperience")} id="fi-yearsOfExperience" />
          </Field>
        </>
      )}

      {currentStatus?.value === "freelancer" && (
        <>
          <Field className="col-span-1">
            <FieldLabel htmlFor="fi-hourlyRate">میزان ساعت فعالیت</FieldLabel>
            <Input {...register("hourlyRate")} id="fi-hourlyRate" />
          </Field>
          <PrimaryCheckbox label="مایل به فعالیت بصورت دورکاری می‌باشم" name="availableForRemote" control={control} />
        </>
      )}

      {currentStatus?.value === "student" && (
        <Field className="col-span-1">
          <FieldLabel htmlFor="fi-university">نام دانشگاه</FieldLabel>
          <Input {...register("university")} id="fi-university" />
        </Field>
      )}
    </FieldGroup>
  );
};
