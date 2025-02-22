import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-600">
      <motion.h1
        className="text-5xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        EDURA
      </motion.h1>
    </div>
  );
};

export default LoadingPage;
