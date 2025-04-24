import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  Home,
  BarChart2,
  Clock,
  Users,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";
import { useAppSelector } from "../hooks";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Falha ao fazer logout.");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: "/", icon: <Home className="w-5 h-5 mr-2" />, label: "Início" },
    {
      path: "/analytics",
      icon: <BarChart2 className="w-5 h-5 mr-2" />,
      label: "Análise",
    },
    {
      path: "/history",
      icon: <Clock className="w-5 h-5 mr-2" />,
      label: "Histórico",
    },
    {
      path: "/social",
      icon: <Users className="w-5 h-5 mr-2" />,
      label: "Social",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm dark:border-gray-700/50"
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between h-16"
        >
          {/* Grupo Esquerdo: Logo + Links Desktop */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <Clock className="w-6 h-6 mr-2 text-blue-600 transition-colors dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                <span className="text-xl font-bold text-blue-600 transition-colors dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  TimeFlow
                </span>
              </Link>
            </div>
            {/* Navegação Desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  asChild
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                  )}
                >
                  <Link to={item.path}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Grupo Direito: Ações */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Menu do Usuário (Desktop) */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Minha Conta
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Botão Menu Mobile */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className="justify-start w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={item.path} className="flex items-center px-4 py-2">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
            {/* Separador e Logout no Mobile */}
            <div className="px-4 pt-3">
              <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="px-4 py-2 text-sm text-muted-foreground">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              className="justify-start w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;
