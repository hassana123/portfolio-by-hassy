"use client";

import { useRef, useState,useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Coffee, Code, Lightbulb } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [floatingPositions, setFloatingPositions] = useState([]);

  useEffect(() => {
    const generateRandomPositions = () =>
      new Array(5).fill(null).map(() => ({
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
      }));
    setFloatingPositions(generateRandomPositions());
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: Coffee,
      title: "Passion",
      description:
        "I enjoy building web experiences that are smart, simple, and actually helpful... Tech that does not just look good, but gets things done.",
      italic:
        "I run on curiosity, Money, and the occasional “let me just fix one more thing” at 2am.",
    },
    {
      icon: Code,
      title: "Experience",
      description:
        "From hackathons to client work, I have built projects ranging from quick landing pages to full blown web applications with real users (not just my friends).",
      italic:
        "Debugging? Let us just say I have had dreams where console.log was talking back to me.",
    },
    {
      icon: Lightbulb,
      title: "Philosophy",
      description:
        "I am all about clean code, thoughtful design, and making things that feel effortless to use. If it is not user-friendly, it is not ready.",
      italic:
        "My code? It may not be perfect, but it is honest, hard-working, and a little sassy—like me.",
    },
  ];

  return (
    <section id="about" className="py-10 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-8"
          >
            <div className="h-px w-12 bg-primary mr-4" />
            <h2 className="text-2xl font-bold">
              About <span className="pink-gradient-text">Me</span>
            </h2>
            <div className="h-px w-12 bg-primary ml-4" />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-[#ec489950] transition-colors group"
              >
                <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ec489915] transition-colors">
                  <feature.icon className="text-primary h-6 w-6 group-hover:text-[#ec4899] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">
                  {feature.description}
                  <span className="italic block mt-2 text-sm">{feature.italic}</span>
                </p>
              </div>
            ))}
          </motion.div>

          {/* About Text + Image */}
          <div className="grid md:grid-cols-2 items-center">
            <motion.div variants={itemVariants} className="mt-10 max-w-6xl mx-auto">
              <p className="text-foreground/80 mb-4">
                I am a frontend developer from Nigeria who enjoys building digital
                experiences that are not just functional but thoughtful. I am big
                on clean code, sleek user interfaces, and making things work seamlessly.
              </p>
              <p className="text-foreground/80">
                Beyond the code, I thrive in community spaces—mentoring, organizing,
                learning, and unlearning. I have led tech communities, hosted developer
                events, and built solutions that empower real people.
                <br /> When I am not in dev mode, I am usually nose-deep in a
                fictional novel.
                <br />
                <i className="text-sm">
                  I especially love stories by African and Black authors that mess
                  with your emotions and leave you questioning everything.
                </i>
              </p>
            </motion.div>

            {/* Image with Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-10"
            >
              <div className="relative mx-auto w-full max-w-md aspect-square">
                {/* Gradient BG Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-[#ec4899] to-blue-500 opacity-20 blur-3xl" />
                <div className="relative z-10 w-[400px] h-[400px] rounded-full border-2 border-blue-500/30 overflow-hidden">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1890754622807019520/vsmubyFs_400x400.jpg"
                    alt="Hassana Abdullahi"
                    width={600}
                    height={600}
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Decorative Floating Elements - hidden on small screens */}
                <div className="hidden md:block">
            {floatingPositions.map((pos, i) => (
              <motion.div
                key={i}
                className={`absolute w-20 h-20 rounded-full ${
                  i % 2 === 0 ? "bg-blue-500/10" : "bg-[#ec4899]/10"
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                }}
                animate={{
                  x: [0, 30, 0],
                  y: [0, 30, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i,
                }}
              />
            ))}
          </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
