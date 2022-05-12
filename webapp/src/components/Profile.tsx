import React from 'react'
import ProfileCard from './profileComponents/ProfileCard';

const Profile = () => {
  const userData = {
    id: 1,
    name: "Elon Musk",
    email: "rc@gmail.com",
    github: 'https://github.com/imryan',
    summery: 'this is a summery',
    bio: 'this is a bio',
    socialLinks: {twitter: 'https://twitter.com/ryancohen', linkIn: 'https://www.linkedin.com/in/ryandcohen/'},
    avatar: '/images/avatar.jpg',
  }


  return (
    <>
    <h2>Good day --name goes here--</h2>
    <div>Profile</div>
    <ProfileCard />
    </>
  )
}

export default Profile