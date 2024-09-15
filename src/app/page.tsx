"use client";

import Image from "next/image";
import Layout from "@/components/Layout";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import AirDrop from "../images/airdrop.png";
import ImgBg from "../images/cf13d8d0bc89f5b9b02a5917f4b02135.jpg";
import Header from "@/components/Header";
import { Gamepad2, Headphones, Trophy, Users } from "lucide-react";
import Link from "next/link";



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out"
  const variantStyles = {
    default: "bg-white text-black hover:bg-gray-200 hover:scale-105",
    outline: "bg-transparent text-white border border-white hover:bg-white hover:text-black hover:scale-105"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}



export default function Home() {
  const [showAirdrop, setShowAirdrop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAirdrop(true), 2000);
    return () => clearTimeout(timer);
  }, []);



  return (
    <>
      <Layout>
        <main className="flex-1 ">
          <section className="w-full py-12 flex items-center md:py-24 lg:py-32 xl:py-48 relative overflow-hidden  h-[100vh]">
            <Image
              src={ImgBg}
              alt="PUBG Mobile Battle Scene"
              layout="fill"
              objectFit="cover"
              objectPosition="center top"
              className="absolute inset-0 "
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-3">
                  <h1 className="text-3xl text-[#DAA520] font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fadeInUp">
                    Welcome to PUBG Mobile Fan Site
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl animate-fadeInUp animation-delay-200">
                    Your ultimate destination for all things PUBG Mobile. Join
                    the community, stay updated, and dominate the battleground!
                  </p>
                </div>
                <div className="space-x-4 animate-fadeInUp animation-delay-400">
                 <Link href='\tournaments'>
                 <Button className="animate-gunfire bg-[#DAA520]">
                    Join Now
                  </Button>
                 </Link>
                  <Button
                    className="border-[#DAA520] text-[#DAA520]"
                    variant="outline"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl text-white font-bold tracking-tighter sm:text-5xl text-center mb-12 animate-fadeInUp">
                Features
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="space-y-3 bg-gray-700 p-6 text-white animate-fadeInUp animation-delay-200 hover:shadow-lg transition-all duration-300 ease-in-out">
                  <CardHeader>
                  <Users className="h-10 w-10 mb-2 animate-bounce" />
                  </CardHeader>
                  <CardTitle className="text-xl font-bold">Community</CardTitle>
                  <CardContent>
                      Connect with fellow PUBG Mobile enthusiasts and make new
                      friends.
                  </CardContent>
                </Card>
                <Card className="space-y-3 p-6 bg-gray-700 text-white animate-fadeInUp animation-delay-400 hover:shadow-lg transition-all duration-300 ease-in-out">
                  <CardHeader>
                  <Trophy className="h-10 w-10 mb-2 animate-bounce animation-delay-200" />
                  </CardHeader>
                  <CardTitle className="text-xl font-bold">Tournaments</CardTitle>
                  <CardContent>
                      Participate in exciting tournaments and win amazing
                      prizes.
                  </CardContent>
                </Card>
                <Card className="space-y-3  p-6 bg-gray-700 text-white animate-fadeInUp animation-delay-600 hover:shadow-lg transition-all duration-300 ease-in-out">
                  <CardHeader>
                  <Headphones className="h-10 w-10 mb-2 animate-bounce animation-delay-400" />
                  </CardHeader>
                  <CardTitle className="text-xl font-bold">Strategy Guides</CardTitle>
                  <CardContent>
                      Access expert tips and strategies to improve your
                      gameplay.
                  </CardContent>
                </Card>
                <Card className="space-y-3 p-6 bg-gray-700 text-white animate-fadeInUp animation-delay-800 hover:shadow-lg transition-all duration-300 ease-in-out">
                  <CardHeader>
                  <Gamepad2 className="h-10 w-10 mb-2 animate-bounce animation-delay-600" />
                  </CardHeader>
                  <CardTitle className="text-xl font-bold">Latest Updates</CardTitle>
                  <CardContent>
                      Stay informed about the latest PUBG Mobile news and
                      updates.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fadeInUp">Join Our Community</h2>
                  <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fadeInUp animation-delay-200">
                    Be part of the fastest-growing PUBG Mobile community. Share your experiences, learn from others, and dominate the battleground together!
                  </p>
                </div>
               <Link href="/tournaments">
                  <Button className="animate-bounce duration-700">Sign Up Now</Button>
               </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}
