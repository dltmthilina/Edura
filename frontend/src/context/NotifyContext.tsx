import { createContext, ReactNode, useContext, useState } from "react";

interface NotifiContextType {
  message: string;
  code: number;
  type: "success" | "info" | "warning" | "error";
  isShow: boolean;
}

interface NotifiContextValue {
  notifi: NotifiContextType;
  setNotifi: (newNotifi: NotifiContextType) => void;
}

const NotifiContext = createContext<NotifiContextValue | undefined>(undefined);

export const NotifiProvider = ({ children }: { children: ReactNode }) => {
  const [notifi, setNotifi] = useState<NotifiContextType>({
    message: "",
    code: 0,
    type: "success",
    isShow: false,
  });

  return (
    <NotifiContext.Provider value={{ notifi, setNotifi }}>
      {children}
    </NotifiContext.Provider>
  );
};

export default NotifiProvider;

export const useNotifi = () => {
  const context = useContext(NotifiContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
