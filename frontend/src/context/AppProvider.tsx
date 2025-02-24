import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import NotifiProvider from "./NotifyContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <NotifiProvider>{children}</NotifiProvider>
    </AuthProvider>
  );
};

export default AppProvider;
