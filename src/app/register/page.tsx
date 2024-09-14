"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "../../data/firebaseUtils";
import Image from "next/image";

import bg_img from "@/assets/images/2225325.jpg";
import { getAuth } from "firebase/auth";
import Header from "@/components/Header";

const auth = getAuth();

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password, name, phone);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("userRegister", JSON.stringify(user));
      }
      
      window.location.href = "/";
    } catch (error) {
      setError("Failed to register. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative">
      <Header/>
      <Image
        src={bg_img}
        alt="PUBG Mobile Battle Scene"
        layout="fill"
        objectFit="cover"
        objectPosition="center top"
        className="absolute inset-0"
      />
      <div className="relative z-10">
        <Card className="w-full max-w-md shadow-lg border border-gray-700 rounded-lg bg-gray-800 bg-opacity-80">
          <CardHeader className="bg-yellow-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-semibold">
              Register for PUBG Mobile
            </CardTitle>
            <CardDescription className="text-sm">
              Create your account to join tournaments and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name" className="font-medium text-yellow-500">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    type="text"
                    required
                    className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-yellow-500 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="phone" className="font-medium text-yellow-500">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    type="tel"
                    required
                    className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-yellow-500 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-medium text-yellow-500"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    required
                    className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-yellow-500 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-medium text-yellow-500"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Create a password"
                    required
                    className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-yellow-500 bg-gray-700 text-white"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              <Button
                type="submit"
                className="w-full mt-6 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring focus:ring-yellow-500"
              >
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="p-4 text-center bg-gray-700 rounded-b-lg">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-500 hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
