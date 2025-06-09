"use client";
import React, { useState } from "react";
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

  { name: "Github", href: "https://github.com/your-repo", isExternal: true },
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
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
        ref={ref as any}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  return <>{children}</>;
};

const SheetTrigger: React.FC<SheetTriggerProps> = ({ asChild, children }) => {
  const Comp = asChild ? "span" : "button";
  return <Comp onClick={() => {}}>{children}</Comp>;
};

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    );
  }
);
SheetContent.displayName = "SheetContent";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavLinkClick = (link: NavLink) => {
    setIsMobileMenuOpen(false);
    if (link.isHash) {
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (link.isExternal) {
      window.open(link.href, "_blank", "noopener noreferrer");
    } else {
      window.location.href = link.href;
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
        {/* Logo/Brand Name */}
        <motion.a
          href="#"
          className="text-black text-2xl font-bold rounded-lg px-3 py-1 bg-white bg-opacity-10 backdrop-blur-sm shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/logo.png"
            alt="Description of image"
            width={60}
            height={60}
          />
        </motion.a>

        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300 relative group"
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={() => handleNavLinkClick(link)}
            >
              {link.name}

              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </motion.a>
          ))}
          <Button className="ml-4 bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 rounded-full shadow-md px-6 py-3 font-semibold">
            <Link href="/AnalyzeDeck">Analyze Deck</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Open mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] bg-gradient-to-b from-indigo-700 to-purple-800 text-white border-none shadow-2xl"
            >
              <AnimatePresence>
                {" "}
                {}
                {isMobileMenuOpen && (
                  <motion.div
                    className="flex flex-col space-y-4 pt-8"
                    variants={mobileMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex justify-end pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white hover:bg-white hover:text-indigo-700 transition-colors"
                      >
                        <X className="h-7 w-7" />
                        <span className="sr-only">Close mobile menu</span>
                      </Button>
                    </div>
                    {navLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-3 text-xl font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                        onClick={() => handleNavLinkClick(link)}
                        variants={navItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                      >
                        {link.name}
                      </motion.a>
                    ))}
                    <Button className="mt-6 mx-4 bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 rounded-full shadow-md px-6 py-3 font-semibold text-lg">
                      <Link href="/AnalyzeDeck">Analyze Deck</Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
