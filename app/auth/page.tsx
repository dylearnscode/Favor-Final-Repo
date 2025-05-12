"use client"

import { useState } from "react"
import { FavorLogo } from "@/components/favor-logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <FavorLogo size="lg" />
          <h1 className="mt-6 text-3xl font-bold text-white">
            {activeTab === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {activeTab === "login" ? "Sign in to your account to continue" : "Sign up to start exchanging services"}
          </p>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm type="login" />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm type="signup" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
