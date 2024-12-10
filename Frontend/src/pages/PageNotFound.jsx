import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.5 } },
    exit: { opacity: 0, transition: { duration: 0.8 } },
  };

  const glitchVariants = {
    animate: {
      textShadow: [
        "0px 0px 3px #ff0000, 0px 0px 5px #0000ff",
        "0px 0px 5px #00ff00, 0px 0px 7px #ff0000",
        "0px 0px 3px #0000ff, 0px 0px 5px #00ff00",
      ],
      transition: { duration: 1.7, repeat: Infinity },
    },
  };
  const navigate = useNavigate();
  const moveToHome = () => {
    navigate("/");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center h-screen  text-white"
    >
      <motion.div className="relative flex flex-col items-center">
        <motion.div
          className="text-9xl font-bold text-red-600 select-none"
          initial={{ opacity: 1 }}
          animate={{
            opacity: [1, 0.5, 1], // Alternate between full and partial opacity
          }}
          transition={{
            duration: 0.9, // Duration for one blink cycle
            repeat: Infinity, // Loop the animation infinitely
            ease: "easeInOut", // Smooth transitions
          }}
        >
          404
        </motion.div>
        <motion.h1
          variants={glitchVariants}
          className="text-3xl font-semibold text-gray-300 mt-2 select-none"
        >
          Oops! Server Crashed!
        </motion.h1>
        <motion.p
          className="text-lg text-gray-400 mt-4 text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
        >
          We couldn't find the page you were looking for. Maybe our servers need
          a coffee break ☕!
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.5 },
        }}
        className="mt-10 flex items-center justify-center"
      >
        <button
          onClick={moveToHome}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-lg
            bg-gradient-to-r from-green-600 to-emerald-600 
          "
        >
          Go Back Home
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
