type Skill = {
  name: string;
  level: "junior" | "mid" | "senior";
};

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description: string;
};

type SocialLink = {
  platform: "github" | "linkedin" | "twitter" | "website";
  url: string;
};

type ApplicantFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  cellphone: string;
  age: number;
  portfolioUrl?: string;

  currentStatus: "student" | "employed" | "freelancer" | "unemployed";

  currentCompany?: string;
  yearsOfExperience?: number;

  university?: string;

  hourlyRate?: number;
  availableForRemote?: boolean;

  skills: Skill[];
  experiences: Experience[];
  socialLinks: SocialLink[];

  expectedSalary?: number;
  preferredWorkType: "onsite" | "remote" | "hybrid";
  acceptRelocation: boolean;
  bio: string;
};
