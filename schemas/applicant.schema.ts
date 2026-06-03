import { z } from "zod";

export const schema = z
  .object({
    // perosnal info
    firstname: z.string().min(3, "حداقل 3 کاراکتر"),
    lastname: z.string().min(3, "حداقل 3 کاراکتر"),
    email: z.email(),
    cellphone: z.string().regex(/^09\d{9}$/),
    age: z.number().int(),
    portfolioUrl: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().url("آدرس وبسایت نامعتبر است").optional(),
    ),

    // professional status
    currentStatus: z
      .object({ label: z.string(), value: z.enum(["student", "employed", "freelancer", "unemployed"]) })
      .nullable(),
    currentCompany: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().optional(),
    ),
    yearsOfExperience: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().optional(),
    ),
    hourlyRate: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().optional(),
    ),
    availableForRemote: z.boolean().optional(),
    university: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().optional(),
    ),

    // Skills
    skills: z.array(
      z.object({
        name: z.string(),
        level: z.object({ label: z.string(), value: z.enum(["junior", "mid", "senior"]) }),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data?.currentStatus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["currentStatus"], message: "انتخاب وضعیت شغلی الزامی است" });
    }
    if (data?.currentStatus?.value === "employed" && !data?.currentCompany) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentCompany"],
        message: "نام شرکت برای افراد شاغل الزامی است",
      });
    }
    if (data?.currentStatus?.value === "employed" && !data?.yearsOfExperience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yearsOfExperience"],
        message: "مقدار سابقه فعالیت برای افراد شاغل الزامی است",
      });
    }
    if (data?.currentStatus?.value === "freelancer" && !data?.hourlyRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hourlyRate"],
        message: "میزان فعالیت روزانه برای افراد فریلنسر الزامی است",
      });
    }
    if (data?.currentStatus?.value === "student" && !data?.university) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["university"],
        message: "نام دانشگاه برای افراد دانشجو الزامی است",
      });
    }
  });
