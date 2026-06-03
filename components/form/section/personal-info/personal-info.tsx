"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const PersonalInfo = () => {
  const { register } = useFormContext();

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-firstname">نام</FieldLabel>
        <Input {...register("firstname")} id="fi-firstname" />
      </Field>
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-lastname">نام خانوداگی</FieldLabel>
        <Input {...register("lastname")} id="fi-lastname" />
      </Field>
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-email">پست الکترونیک</FieldLabel>
        <Input {...register("email")} id="fi-email" />
      </Field>
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-cellphone">تلفن همراه</FieldLabel>
        <Input {...register("cellphone")} id="fi-cellphone" />
      </Field>
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-age">سن</FieldLabel>
        <Input {...register("age", { valueAsNumber: true })} id="fi-age" />
      </Field>
      <Field className="col-span-1">
        <FieldLabel htmlFor="fi-portfolioUrl">وبسایت</FieldLabel>
        <Input {...register("portfolioUrl")} id="fi-portfolioUrl" />
      </Field>
    </FieldGroup>
  );
};
