"use client";

import { motion } from "framer-motion";
import { Upload, Lightbulb, Users, BarChart } from "lucide-react";
import Link from "next/link";

const Button = ({
  className,
  children,
  onClick,
  type = "button",
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center font-medium rounded-md ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const featureItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <>
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          id="home"
          className="relative flex items-center justify-center min-h-[60vh] md:min-h-[80vh] bg-gradient-to-br from-indigo-50 to-purple-50 py-16 px-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
          <div className="container mx-auto text-center z-10 max-w-4xl">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Uncover Your Pitch Deck&apos;s Potential with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
                AI-Powered Analysis
              </span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Instantly summarize key metrics, identify market size, product
              fit, team strength, and uncover crucial red flags. Get
              investor-ready in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
            >
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                <Link href="/AnalyzeDeck">Analyze Your Deck Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              How Our AI Analyzer Works
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: Upload,
                  title: "1. Upload Your Deck",
                  description: "Securely upload your pitch deck (PDF/Docx).",
                },
                {
                  icon: Lightbulb,
                  title: "2. AI Analysis",
                  description:
                    "Our advanced AI processes content for key data.",
                },
                {
                  icon: BarChart,
                  title: "3. Instant Insights",
                  description:
                    "Receive summarized metrics and actionable insights.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center text-center border border-indigo-100 transform hover:scale-105 transition-transform duration-300"
                  variants={featureItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <feature.icon
                    size={60}
                    className="text-indigo-600 mb-6 bg-indigo-100 p-3 rounded-full"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="py-16 md:py-24 bg-white px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              About Our Team
            </motion.h2>
            <motion.div
              className="bg-indigo-50 rounded-2xl p-8 md:p-12 shadow-xl border border-indigo-200"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Users
                size={80}
                className="text-indigo-600 mx-auto mb-6 bg-white p-4 rounded-full shadow-md"
              />
              <p className="text-lg text-gray-800 leading-relaxed">
                We are a dedicated team of AI enthusiasts and startup advisors
                passionate about empowering entrepreneurs. Our mission is to
                provide cutting-edge tools that simplify the complex process of
                pitch deck analysis, helping you refine your narrative and
                secure investment with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-gray-50 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Have questions or need support? Reach out to us!
            </motion.p>
            <motion.div
              className="flex flex-col items-center space-y-4"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300"
                onClick={() =>
                  (window.location.href = "nitinvermanv61506@gmail.com")
                }
              >
                Email Us
              </Button>
              <p className="text-gray-600 text-sm">
                nitinvermanv61506@gmail.com
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
