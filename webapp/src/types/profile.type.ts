export interface UserData {
  id: number;
  name: string;
  email: string;
  github: string;
  summery: string;
  bio: string;
  socialLinks: { [key: string]: string };
  avatar: string;
}

export interface UserDataProps {
  userData: UserData;
}

export interface EditStateProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
}