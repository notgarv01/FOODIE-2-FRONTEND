import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import AccountDetails from './AccountDetails';

const Profile = () => {
  const { userData } = useOutletContext();

  return (
    <>
      <ProfileHeader userData={userData} />
      <AccountDetails userData={userData} />
    </>
  );
};

export default Profile;
