"use client";

import Link from "next/link";
import { MenuIcon, ShieldCloseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import Logo from "@/assets/images/newlogo.png";
import { Typography } from "@mui/material";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-6 lg:px-8 h-16 flex items-center bg-[#1f1f1f] shadow-md">
        <div className="container mx-auto flex items-center p-0 justify-between">
          <Link className="flex items-center space-x-2" href="/">
            {/* <Gamepad2 className="h-8 w-8 text-white transition-transform duration-300 ease-in-out transform hover:rotate-12" /> */}
            <Image src={Logo} width={50} height={50} alt="PUBG ZONE" />
            <Typography
              style={{color: '#DAA520'}}
              variant="h5"
              color="initial"
              className="font-bold"
            >
              PUBG ZONE
            </Typography>
          </Link>
          <nav className="hidden lg:flex lg:gap-8">
            <Link
              className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                isActive("/") ? "text-blue-400" : "text-white"
              } hover:text-blue-400`}
              href="/"
            >
              Home
            </Link>
            {/* <Link
              className={`text-lg font-medium transition-colors duration-300 ease-in-out ${isActive('/schedule') ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              href="/schedule"
            >
              Schedule
            </Link> */}
            <Link
              className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                isActive("/tournaments") ? "text-blue-400" : "text-white"
              } hover:text-blue-400`}
              href="/tournaments"
            >
              Tournaments
            </Link>

            {localStorage.getItem("userRegister") ? (
              <Link
                className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                  isActive("/profile") ? "text-blue-400" : "text-white"
                } hover:text-blue-400`}
                href="/profile"
              >
                Profile
              </Link>
            ) : (
              <Link
                className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                  isActive("/register") ? "text-blue-400" : "text-white"
                } hover:text-blue-400`}
                href="/register"
              >
                Register
              </Link>
            )}
          </nav>
          <button
            className="lg:hidden flex  items-center text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <ShieldCloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-75 lg:hidden">
          <div className="flex flex-col items-center mt-16">
            <Link
              className={`text-xl font-medium py-4 ${
                isActive("/") ? "text-blue-400" : "text-white"
              } hover:text-blue-400`}
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {/* <Link
              className={`text-xl font-medium py-4 ${isActive('/schedule') ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              href="/schedule"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Schedule
            </Link> */}
            <Link
              className={`text-xl font-medium py-4 ${
                isActive("/tournaments") ? "text-blue-400" : "text-white"
              } hover:text-blue-400`}
              href="/tournaments"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tournaments
            </Link>
            {
              localStorage.getItem("userRegister") ? (
                <Link
                className={`text-xl font-medium py-4 ${
                  isActive("/profile") ? "text-blue-400" : "text-white"
                } hover:text-blue-400`}
                href="/tournaments"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              ) : (
                <Link
                className={`text-xl font-medium py-4 ${
                  isActive("/register") ? "text-blue-400" : "text-white"
                } hover:text-blue-400`}
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
              )
            }
            
            
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
