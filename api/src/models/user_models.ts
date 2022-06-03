export interface ISocialNetwork {
  id: number;
  network_name: string;
  protocol: string;
  base_url: string;
}

export interface ISocialProfile {
  network_name: string;
  user_name: string;
  profile_url: string;
  public: boolean;
}

export interface IGitHubUser {
  github_id: number;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  principal_id?: number;
}

export interface IUserData {
  principal_id: number;
  github_accounts?: Array<IGitHubUser>;
  social_profiles?: Array<ISocialProfile>;
  full_name?: string;
  email_address?: string;
  bio?: string;
}
