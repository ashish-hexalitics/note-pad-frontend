import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { userRoutes } from "../../routes/index";
import { setUser } from "../../store/slices/userSlice/reducer";
import { setUser } from "../../store/slices/userSlice/reducer";
import { useSelector } from "react-redux";

function UserLayout() {
  const { user } = useSelector((state) => state.userSlice);
  useEffect(() => {
    console.log(user, "hello");
  }, []);
  return (
    <Routes>
      {userRoutes.map(({ path, component: Component }) => {
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}

export default UserLayout;
