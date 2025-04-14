"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Coffee, Code, Lightbulb } from "lucide-react";
import Image from "next/image";
export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
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
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-8"
          >
            <div className="h-px w-12 bg-primary mr-4"></div>
            <h2 className="text-3xl font-bold">
              About <span className="pink-gradient-text">Me</span>
            </h2>
            <div className="h-px w-12 bg-primary ml-4"></div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-[#ec489950] transition-colors group">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ec489915] transition-colors">
                <Coffee className="text-primary h-6 w-6 group-hover:text-[#ec4899] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-foreground/70">
                I enjoy building web experiences that are smart, simple, and
                actually helpful... Tech that doesn’t just look good, but gets
                things done.
                <span className="italic block mt-2 text-sm">
                  I run on curiosity, Money, and the occasional “let me just fix
                  one more thing” at 2am.
                </span>
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-[#ec489950] transition-colors group">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ec489915] transition-colors">
                <Code className="text-primary h-6 w-6 group-hover:text-[#ec4899] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experience</h3>
              <p className="text-foreground/70">
                From hackathons to client work, I’ve built projects ranging from
                quick landing pages to full blown web applications with real
                users (not just my friends).
                <span className="italic block mt-2 text-sm">
                  Debugging? Let's just say I've had dreams where console.log
                  was talking back to me.
                </span>
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-[#ec489950] transition-colors group">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ec489915] transition-colors">
                <Lightbulb className="text-primary h-6 w-6 group-hover:text-[#ec4899] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Philosophy</h3>
              <p className="text-foreground/70">
                I’m all about clean code, thoughtful design, and making things
                that feel effortless to use. If it’s not user-friendly, it's not
                ready.
                <span className="italic block mt-2 text-sm">
                  My code? It may not be perfect, but it's honest, hard-working,
                  and a little sassylike me.
                </span>
              </p>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 items-center">
          <motion.div
            variants={itemVariants}
            className="mt-10 max-w-6xl mx-auto "
          >
            <p className="text-foreground/80 mb-4">
              I am a frontend developer from Nigeria who enjoys building digital
              experiences that are not just functional but thoughtful. I’m big
              on clean code, sleek user interface, and making things work seamlessly
            </p>
            <p className="text-foreground/80">
              Beyond the code, I thrive in community spaces, mentoring,
              organizing, learning, and unlearning. I’ve led tech communities,
              hosted developer events, and built solutions that empower real
              people.
              <br /> When I’m not in dev mode, I’m usually nose-deep in a
              fictional novel. <br />
              <i className="text-sm ">
           
                I especially love stories by African and Black authors that mess
                with your emotions and leave you questioning everything.
              </i>
            </p>
          </motion.div>
           <motion.div
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.8, delay: 0.2 }}
                       className="relative"
                     >
                       <div className="relative mx-auto w-full max-w-md aspect-square">
                         <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-[#ec4899] to-blue-500 opacity-20 blur-3xl"></div>
                         <div className="relative z-10 w-full h-full rounded-full border-2 border-blue-500/30 overflow-hidden">
                           <Image
                             src="./placeholder.svg"
                             alt="Hassana Abdullahi"
                             width={600}
                             height={600}
                             priority
                             className="object-cover"
                           />
                         </div>
           
                         {/* Decorative elements */}
                         {[...Array(5)].map((_, i) => (
                           <motion.div
                             key={i}
                             className={`absolute w-20 h-20 rounded-full ${i % 2 === 0 ? "bg-blue-500/10" : "bg-[#ec4899]/10"}`}
                             style={{
                               top: `${Math.random() * 100}%`,
                               left: `${Math.random() * 100}%`,
                             }}
                             animate={{
                               x: [0, 30, 0],
                               y: [0, 30, 0],
                               opacity: [0.4, 0.8, 0.4],
                             }}
                             transition={{
                               duration: 5 + i,
                               repeat: Number.POSITIVE_INFINITY,
                               delay: i,
                             }}
                           />
                         ))}
                       </div>
                     </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
