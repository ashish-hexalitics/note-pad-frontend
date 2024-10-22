import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { userRoutes } from "../../routes/index";
import { setUser } from "../../store/slices/userSlice/reducer";
import { useGetUserQuery } from "../../store/slices/userSlice/api";
import { useDispatch, useSelector } from "react-redux";

function UserLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { isLoading, data } = useGetUserQuery();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      if (data && data?.data?.user) {
        dispatch(setUser(data?.data?.user));
      }
    }
  }, [user, data, dispatch]);

  return (
    <Routes>
      {userRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}

export default UserLayout;
