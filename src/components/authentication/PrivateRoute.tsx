import React, { ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

type IPrivateRoute = any & {
  component: ReactNode;
};
export const PrivateRoute = ({
  component: Component,
  ...rest
}: IPrivateRoute) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    ></Route>
  );
};
