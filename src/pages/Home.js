import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {

  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.5, 
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div
      className="h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col justify-center items-center text-white"
      style={{ height: "calc(100% - 70px)" }}
    >
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={container} 
      >
        <motion.h1 className="text-5xl font-extrabold mb-6" variants={item}>
          Welcome to NotesHub
        </motion.h1>
        
        <motion.p className="text-lg font-light mb-10 max-w-2xl" variants={item}>
          Collaborate, share, and organize your notes seamlessly with NotesHub.
          Whether you're working solo or with a team, NotesHub makes
          collaboration effortless and efficient.
        </motion.p>

        <motion.div className="space-x-4" variants={item}>
          <Link
            to="/login"
            className="bg-white text-indigo-600 py-3 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="bg-white text-purple-600 py-3 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
          >
            Sign Up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
