"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavLink {
  name: string;
  href: string;
  isExternal?: boolean;
  isHash?: boolean;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "#home", isHash: true },
  { name: "How it Works", href: "#how-it-works", isHash: true },
  { name: "About Us", href: "#about-us", isHash: true },
  { name: "Contact", href: "#contact", isHash: true },
  { name: "Github", href: "https://github.com/NITIN-VERMA-afk/PitchPilot-AI", isExternal: true },
];

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavLinkClick = (
    link: NavLink,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.isHash) {
      if (pathname !== "/") {
        router.push(`/${link.href}`);
      } else {
        const element = document.getElementById(link.href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (link.isExternal) {
      window.open(link.href, "_blank", "noopener noreferrer");
    } else {
      router.push(link.href);
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, color: "#6366f1" },
  };

  const mobileMenuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: "0%",
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    exit: {
      x: "100%",
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 shadow-lg sticky top-0 z-50 font-inter">
      <div className="container mx-auto flex justify-between items-center">
        <motion.a
          href="/"
          className="text-black text-2xl font-bold rounded-lg px-3 py-1 bg-white bg-opacity-10 backdrop-blur-sm shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <motion.button
              key={link.name}
              className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300 relative group bg-transparent border-none focus:outline-none"
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={(e) => handleNavLinkClick(link, e)}
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </motion.button>
          ))}
          <Button className="ml-4 bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 rounded-full shadow-md px-6 py-3 font-semibold">
            <Link href="/AnalyzeDeck">Analyze Deck</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </Button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-700 to-purple-800 text-white shadow-2xl flex flex-col p-6"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:bg-white hover:text-indigo-700 transition-colors"
                  >
                    <X className="h-7 w-7" />
                  </Button>
                </div>

                <div className="flex flex-col space-y-4 mt-4">
                  {navLinks.map((link) => (
                    <motion.button
                      key={link.name}
                      className="text-left block px-4 py-3 text-xl font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                      onClick={(e) => handleNavLinkClick(link, e)}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      {link.name}
                    </motion.button>
                  ))}

                  <Button className="mt-6 bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 rounded-full shadow-md px-6 py-3 font-semibold text-lg">
                    <Link href="/AnalyzeDeck">Analyze Deck</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


