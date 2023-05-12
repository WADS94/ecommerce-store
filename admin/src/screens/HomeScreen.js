import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardInfo } from "../Redux/Actions/OrderActions";

import Header from "../components/Header";
import Main from "../components/Home/Main";
import Sidebar from "./../components/sidebar";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getDashboardInfo());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <Main />
      </main>
    </>
  );
};

export default HomeScreen;
