"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";

import BackgroundCircles from "./BackgroundCircles";
import logo from "/_images/logo.png";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [text] = useTypewriter({
    words: [
      "Welcome to EasyRag",
      "Chatbots made easy",
      "Training RAGs has never been easier",
      "Let us do the heavy lifting",
    ],
    // words: heroData.typewriter,
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 100,
  });

  return (
    <div className="h-screen bg-black flex flex-col space-y-8 items-center justify-center text-center overflow-hidden">
      <BackgroundCircles />

      <motion.div
        initial={{
          scale: 0,
        }}
        whileInView={{
          scale: [0, 1.2, 1],
        }}
        transition={{
          type: "spring",
          duration: 2,
          delay: 2,
        }}
        viewport={{ once: true }}
        className="z-20 flex flex-col space-y-4"
      >
        <Image
          src={"/logo.png"}
          width={400}
          height={400}
          priority={true}
          alt="Logo"
          className={
            "relative rounded-full h-40 w-40 mx-auto object-cover z-20 border-4"
          }
        />
        <h2 className="text-sm uppercase text-gray-500 pb-2 tracking-[15px] z-20 cursor-default ">
          EASY RAG
        </h2>
        <div className="z-20">
          <h1 className=" text-3xl text-white md:text-5xl lg:text-6xl font-semibold px-10 h-20">
            <span className="hover:text-[#F7AB0A]/70 transition ease-out duration-200 cursor-default  ">
              {text}
              <Cursor cursorColor="#F7AB0A" cursorStyle="|" />
            </span>
          </h1>
          <div className="pt-5">
            <Link href="/home" className="heroButton">
              Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
