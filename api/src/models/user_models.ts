export interface ISocialProfile {
    network_name: string;
    user_name: string;
    profile_url: string;
};

export interface IGitHubUser {
    github_id: number;
    username: string;
    full_name: string;
    email: string;
    avatar_url: string;
    bio: string;
    principal_id?: number;
};

export interface IUserData {
    principal_id?: number;
    github_id: number;
    full_name?: string;
    email?: string;
    bio?: string;
    avatar_url?: string;
    social_profiles?: Array<ISocialProfile>;
};

// export interface IUserData {
//     principal_id?: number;
//     github_accounts: Array<IGithubUser>;
//     social_profiles?: Array<ISocialProfile>;
//     full_name?: string;
//     email?: string;
//     bio?: string;
// };