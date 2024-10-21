import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { userRoutes } from "../../routes/index";
import { setUser } from "../../store/slices/userSlice/reducer";
import { useGetUserQuery } from "../../store/slices/userSlice/api";
import { getNotes } from "../../store/slices/noteSlice/reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function UserLayout() {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [getUser, { isLoading, data }] = useGetUserQuery();
  useEffect(() => {
    console.log(data, "hello");
  }, [data]);
  return (
    <Routes>
      {userRoutes.map(({ path, component: Component }) => {
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}

export default UserLayout;
