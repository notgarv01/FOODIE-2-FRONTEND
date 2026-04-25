import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import AccountDetails from './AccountDetails';
import OrderHistory from '../OrderHistory';

const ProfileOrders = () => {
  const { userData } = useOutletContext();

  return (
    <>
      <OrderHistory />
    </>
  );
};

export default ProfileOrders;
