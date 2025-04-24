import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Clock, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";

export const Header = () => {
  const navItems = [
    { path: "/", label: "Calendário" },
    { path: "/analytics", label: "Análise" },
    { path: "/history", label: "Histórico" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800/95 dark:border-gray-700 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Clock className="w-6 h-6 text-blue-600 transition-colors dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
              <span className="ml-2 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                TimeFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center text-blue-600 dark:text-blue-400">
                    <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    TimeFlow
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <div className="flex flex-col mt-4 space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      asChild
                      className="justify-start hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};
