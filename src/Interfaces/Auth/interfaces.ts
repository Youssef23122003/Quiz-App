export interface ILogData {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
}

export interface topStudent {
  _id: string;
  first_name: string;
  last_name: string;
  avg_score: number;
  group: {
    name: string;
  };
}
export interface AuthState {
  token: string | null
  LogData: ILogData | null
}

export interface UserRegister{
    first_name:string,
    last_name:string,
    email:string,
    password:string,
    role:string
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  email: string
  otp: string
  password: string
  confirmPassword: string
}
export interface ChangePasswordForm {
 
  password: string
 password_new:string
}


export interface Logged_in_Users {
  email: string;
  password: string;
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onMenuToggle: () => void
  isSidebarOpen: boolean
}

