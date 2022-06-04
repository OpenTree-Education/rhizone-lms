import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { SocialProfile } from '../types/api';

import RedditIcon from '@mui/icons-material/Reddit';
import MailIcon from '@mui/icons-material/Mail';

interface SocialProfileLinksProps {
  profileList: SocialProfile[] | undefined;
  updateUserFunction: () => void;
}

const renderGitHubProfileLink = (social_profile: SocialProfile): JSX.Element => {
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="GitHub">
      <IconButton component="a" href={social_profile.profile_url}>
        <GitHubIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderLinkedInProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="LinkedIn">
      <IconButton component="a" href={social_profile.profile_url}>
        <LinkedInIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderTwitterProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Twitter">
      <IconButton component="a" href={social_profile.profile_url}>
        <TwitterIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderRedditProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Reddit">
      <IconButton component="a" href={social_profile.profile_url}>
        <RedditIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderWebsiteLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Website">
      <IconButton component="a" href={social_profile.profile_url}>
        <LanguageIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderDribbbleProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Dribbble">
      <IconButton component="a" href={social_profile.profile_url}>
        <SportsBasketballIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderEmailLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="email">
      <IconButton component="a" href={social_profile.profile_url}>
        <MailIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const SocialProfileLinks = ({
  profileList,
  updateUserFunction
}: SocialProfileLinksProps): JSX.Element => {
  if (!profileList) {
    return <></>;
  }
  return (<>
    {profileList.map((social_profile: SocialProfile) => {
      switch (social_profile.network_name) {
        case "GitHub":
          return renderGitHubProfileLink(social_profile);
        case "LinkedIn":
          return renderLinkedInProfileLink(social_profile);
        case "Twitter":
          return renderTwitterProfileLink(social_profile);
        case "Reddit":
          return renderRedditProfileLink(social_profile);
        case "website":
          return renderWebsiteLink(social_profile);
        case "Dribbble":
          return renderDribbbleProfileLink(social_profile);
        case "email":
          return renderEmailLink(social_profile);
        default:
          return <a key={social_profile.profile_url} href={social_profile.profile_url}>{social_profile.network_name}</a>
      }
    })}<button onClick={updateUserFunction}>Change the name</button>
  </>);
}

// const SocialProfileLinks = ({
//   isEditable,
//   profileList,
// }: SocialProfileLinksProps) => {
//   // Here's what antonina had:
//   // const [socialNetworkList, setsocialNetworkList] = useState<SocialProfile[]>(
//   //   []
//   // );
//   console.log(profileList);
//   const [socialProfileList, setSocialProfileList] = useState<SocialProfile[]>([
//     profileList[0],
//   ]);
//   console.log(socialProfileList);
//   socialProfileList.forEach((social_profile: SocialProfile) => {
//     console.log(social_profile);
//   });
//   if (!profileList) {
//     return <p>Error, here is no social profile.</p>;
//   }

//   // We need to retrieve a list of all possible social networks

//   // We need to retrieve the UserData object from the API

//   // We need to select the SocialProfile[] list from the UserData object

//   // for each row in the SocialProfile[] list, we need to

//   // render the correct icon, linked to the profile_url of the SocialProfile

//   // when we hit the edit button, each of these buttons should turn into:

//   // form row with three components:
//   // - a drop-down list of [all possible social networks] with the one selected corresponding to the social network of that socialprofile
//   // - the user_name of the socialprofile
//   // - a checkbox linked to public visibility of the socialprofile

//   // plus we should also see a "add social network" button that adds a new form row that looks like the above

//   // when the user saves from edit, the entire UserData object is sent back to /profile/:principalID with an HTTP PUT

//   return (
//     <>
//       {socialProfileList.map(network => {
//         if (network?.network_name === 'github') {
//           return !isEditable ? (
//             <Grid item key={network?.network_name}>
//               <Tooltip title="GitHub">
//                 <IconButton component="a" href={network?.profile_url}>
//                   <GitHubIcon color="primary" />
//                 </IconButton>
//               </Tooltip>
//             </Grid>
//           ) : (
//             <Grid
//               item
//               xs={isEditable ? 10 : 1}
//               ml={{ md: -3, sm: -1, xs: -3 }}
//               display="flex"
//               justifyContent="flex-start"
//               alignItems="flex-start"
//               key={network?.network_name}
//             >
//               <GitHubIcon color="primary" sx={{ ml: 3, mr: 1 }} />
//               <TextField
//                 disabled
//                 variant="standard"
//                 value={network?.network_name}
//               />
//             </Grid>
//           );
//         } else {
//           return !isEditable ? (
//             <Grid item xs={isEditable ? 10 : 1} key={network?.network_name}>
//               <Tooltip title={network?.network_name}>
//                 <IconButton
//                   component="a"
//                   sx={{ mr: 1 }}
//                   href={network?.profile_url}
//                 >
//                   {(socialNetworkIcons as any)[network?.network_name]}
//                 </IconButton>
//               </Tooltip>
//             </Grid>
//           ) : (
//             <p>Hello, world! (UpdateSocialLinks)</p>
//           );
//         }
//       })}
//       <Grid item xs={isEditable ? 10 : 1}>
//         {/* The button will disappear after adding five additional social network fields */}
//         {isEditable && socialProfileList.length <= 5 && (
//           <Button
//             component="button"
//             variant="contained"
//             onClick={() => {
//               setSocialProfileList(prevState => [
//                 ...prevState,
//                 {
//                   network_name: '',
//                   profile_url: '',
//                   public: 2,
//                   user_name: '',
//                 },
//               ]);
//             }}
//           >
//             Add a Network
//           </Button>
//         )}
//       </Grid>
//     </>
//   );
// };

export default SocialProfileLinks;
