export interface CreateJobBody {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
}

export interface JobParams {
  id: string;
}
