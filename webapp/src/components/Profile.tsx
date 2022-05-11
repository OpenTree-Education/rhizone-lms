import { Button, Card, CardContent } from '@mui/material';
import React from 'react';
import { ProfileType } from '../types/api';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

interface ProfileProps {
  profileObj: ProfileType;
}

// test

const Profile = ({ profileObj }: ProfileProps) => {
  /* 
    Name - string
    Email - string 
    Summary / Bio - string
    Avatar / Profile Picture - string
    Github -> link 
    Social Media Links [] -> array of links (facebook, twitter, instagram, youtube)
    Link to Website -> link
    Journal -> link (reroute)
    Competencies -> link (reroute)
    1:1 Meeting Notes -> link (reroute)
    Time progression of improvement ?
*/

  // const studentData = [
  //   {id: 1, name: 'Tenzin', email: 'student1@gmail.com', avatar: 'image-url', bio: 'this is my bio to display'},
  //   {id: 2, name: 'James', email: 'student2@gmail.com', avatar: 'image-url', bio: 'this is my bio again'},
  //   {id: 3, name: 'Shea', email: 'student3@gmail.com', avatar: 'image-url', bio: 'another bio to display'},
  //   {id: 4, name: 'Antonina', email: 'student4@gmail.com', avatar: 'image-url', bio: 'another one'},
  // ]

  return (
    <Card>
      <CardContent>{profileObj.name}</CardContent>
      <CardContent>{profileObj.email}</CardContent>
      <CardContent>{profileObj.bio}</CardContent>
      <CardContent><GitHubIcon /></CardContent>
      <CardContent><TwitterIcon /></CardContent>
      <CardContent><Button href="#text-buttons">Website</Button></CardContent>
    </Card>
  );
};

export default Profile;

{
  /* <form>
  
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form> */
}
