import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import UserLayout from "../pages/UserLayout/index";
import NotePadList from "../pages/NotePade/List";
import NotePade from "../pages/NotePade/NotePade";

export const authRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];

export const privateRoutes = [
  {
    path: "/notes",
    component: NotePadList,
  },
  {
    path: "/user/*",
    component: UserLayout,
  },
];

export const userRoutes = [
  {
    path: "notes",
    component: NotePadList,
  },
  {
    path: "add-note/:noteId",
    component: NotePade,
  },
  {
    path: "edit-note/:noteId",
    component: NotePade,
  },
];
