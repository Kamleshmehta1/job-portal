export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: "client" | "freelancer";
}

export interface LoginBody {
  email: string;
  password: string;
}
