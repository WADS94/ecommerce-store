import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import { getUserDetails } from "../Redux/Actions/userActions";
import ProfileMain from "./../components/users/ProfileMain";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserDetails("profile"));
  }, [dispatch]);

  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <ProfileMain />
      </main>
    </>
  );
};

export default ProfileScreen;
