"use client";

import dynamic from "next/dynamic";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { schema } from "@/schemas/applicant.schema";

import { PersonalInfo } from "./section/personal-info/personal-info";
import { Button } from "../ui/button";
import { ProfessionalStatus } from "./section/professional-status/professional-status";
import { SubmitButton } from "../custom-ui/submit-button/submit-button";
import { ErrorSummary } from "../custom-ui/error-summary/error-summary";

const Skills = dynamic(() => import("./section/skills/skills"), { ssr: false });

type FormValues = z.input<typeof schema>;

export const ApplicantForm = () => {
  const defaultValues: FormValues = {
    age: 0,
    cellphone: "",
    email: "",
    firstname: "",
    lastname: "",
    //
    currentStatus: null,
    //
    skills: [{ name: "", level: { label: "متوسط", value: "mid" } }],
  };

  const methods = useForm<FormValues>({ defaultValues, mode: "onChange", resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="">
      <FormProvider {...methods}>
        <ErrorSummary />
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PersonalInfo />
          <ProfessionalStatus />
          <Skills />

          <SubmitButton />
        </form>
      </FormProvider>
    </div>
  );
};
