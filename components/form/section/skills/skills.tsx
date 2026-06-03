"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Field, FieldLabel } from "@/components/ui/field";

import { PrimaryCombobox } from "@/components/custom-ui/primary-combobox/primary-combobox";
import { Input } from "@/components/ui/input";
import { CircleArrowDown, CircleArrowUp, CircleMinus, CirclePlus } from "lucide-react";

export const Skills = () => {
  const { register, control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({ name: "skills", control });

  const skills = useWatch({ name: "skills", control });

  const skillOptions: { label: string; value: "junior" | "mid" | "senior" }[] = [
    { label: "کم", value: "junior" },
    { label: "متوسط", value: "mid" },
    { label: "زیاد", value: "senior" },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        {fields.map((item, index) => {
          return (
            <div key={item?.id} className="grid grid-cols-4 gap-4">
              <Field className="col-span-1">
                <FieldLabel htmlFor={`fi-skills-${item?.id}`}>مهارت</FieldLabel>
                <Input {...register(`skills.${index}.name`)} id={`fi-skills-${item?.id}`} />
              </Field>
              <PrimaryCombobox
                items={skillOptions}
                name={`skills.${index}.level`}
                placeholder="سطح"
                control={control}
              />
              <div className="col-span-1 flex gap-2">
                {skills.length !== index + 1 && (
                  <span className="self-end" onClick={() => move(index, index + 1)}>
                    <CircleArrowDown size={24} strokeWidth="1.5px" />
                  </span>
                )}
                {index + 1 > 1 && (
                  <span className="self-end" onClick={() => move(index, index - 1)}>
                    <CircleArrowUp size={24} strokeWidth="1.5px" />
                  </span>
                )}
                {skills.length > 1 && (
                  <span className="self-end" onClick={() => remove(index)}>
                    <CircleMinus size={24} strokeWidth="1.5px" />
                  </span>
                )}
                {skills.length === index + 1 && (
                  <span className="self-end" onClick={() => append({ name: "", value: "mid" })}>
                    <CirclePlus size={24} strokeWidth="1.5px" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
