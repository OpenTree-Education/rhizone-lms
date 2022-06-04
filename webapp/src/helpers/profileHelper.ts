import { GitHubUser, SocialProfile, UserData } from '../types/api.d';

export const parseServerProfileResponse = (api_user_data: any) : UserData => {
  // default data in case we don't get anything back from the db
  let id = -1;
  let avatar_url = '';
  let full_name = '';
  let bio = '';
  let email_address = '';
  let github_accounts: GitHubUser[] = [];
  let social_profiles: SocialProfile[] = [];

  if (api_user_data && api_user_data.length > 0) {
    const [user_data] = api_user_data;

    if (typeof user_data.id === 'string') {
      id = parseInt(user_data.id);
    } else if (typeof user_data.id === 'number') {
      const { id: userId } = user_data;
      id = userId;
    } else {
      throw new Error("Could not parse principal ID in server response.");
    }

    if (typeof user_data.full_name === "string") {
      const { full_name: fullName } = user_data;
      full_name = fullName;
    }

    if (typeof user_data.bio === "string") {
      const { bio: userBio } = user_data;
      bio = userBio;
    }

    if (typeof user_data.email_address === "string") {
      const { email_address: userEmail } = user_data;
      email_address = userEmail;
    }

    if (Array.isArray(user_data.github_accounts)) {
      const [github_account] = user_data.github_accounts;
      github_accounts.push(github_account);

      if (typeof github_account.avatar_url === "string") {
        const { avatar_url: avatar } = github_account;
        avatar_url = avatar;
      }

      if (typeof github_account.full_name === "string") {
        if (full_name === "") {
          const { full_name: fullName } = github_account;
          full_name = fullName;
        }
      }

      if (typeof github_account.bio === "string") {
        if (bio === "") {
          const { bio: userBio } = github_account;
          bio = userBio;
        }
      }
    }

    if (Array.isArray(user_data.social_profiles) && user_data.social_profiles.length > 0) {
      const { social_profiles: social_profile_list } = user_data;
      social_profiles = social_profile_list;

      social_profile_list.forEach((social_profile: SocialProfile) => {
        if (social_profile.network_name === 'email') {
          if (email_address === '') {
            email_address = social_profile.user_name;
          }
        }
      });
    }
  }

  return {
    id: id,
    full_name: full_name,
    bio: bio,
    avatar_url: avatar_url,
    email_address: email_address,
    github_accounts: github_accounts,
    social_profiles: social_profiles,
  };
}
