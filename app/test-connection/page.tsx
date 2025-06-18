"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnection() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("Starting connection test...\n")

    try {
      // Step 1: Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setResult(
        (prev) =>
          prev +
          `Step 1: Environment Variables
NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || "❌ MISSING"}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✅ Present" : "❌ MISSING"}
Expected URL: https://gmlsrnjjkmgevblmvouk.supabase.co
Actual URL: ${supabaseUrl}
URL Match: ${supabaseUrl === "https://gmlsrnjjkmgevblmvouk.supabase.co" ? "✅" : "❌"}

`,
      )

      if (!supabaseUrl || !supabaseAnonKey) {
        setResult((prev) => prev + "❌ Environment variables are missing. Cannot proceed.\n")
        return
      }

      // Step 2: Create Supabase client
      setResult((prev) => prev + "Step 2: Creating Supabase client...\n")
      const supabase = createBrowserClient()
      setResult((prev) => prev + "✅ Supabase client created successfully\n\n")

      // Step 3: Test basic connection with a simple query
      setResult((prev) => prev + "Step 3: Testing basic connection...\n")

      try {
        const { data, error, status, statusText } = await supabase
          .from("categories")
          .select("count", { count: "exact", head: true })

        setResult(
          (prev) =>
            prev +
            `Response Status: ${status}
Response Status Text: ${statusText}
Error: ${error ? JSON.stringify(error, null, 2) : "None"}
Data: ${JSON.stringify(data, null, 2)}

`,
        )

        if (error) {
          setResult((prev) => prev + `❌ Categories query failed: ${error.message}\n`)

          // Let's try a different approach - test auth
          setResult((prev) => prev + "Step 4: Testing auth connection...\n")
          const { data: authData, error: authError } = await supabase.auth.getSession()

          setResult(
            (prev) =>
              prev +
              `Auth Error: ${authError ? JSON.stringify(authError, null, 2) : "None"}
Auth Data: ${JSON.stringify(authData, null, 2)}

`,
          )
        } else {
          setResult((prev) => prev + "✅ Basic connection successful!\n\n")

          // Step 4: Try to fetch actual categories
          setResult((prev) => prev + "Step 4: Fetching categories...\n")
          const { data: categories, error: categoriesError } = await supabase.from("categories").select("*")

          if (categoriesError) {
            setResult((prev) => prev + `❌ Categories fetch failed: ${categoriesError.message}\n`)
          } else {
            setResult(
              (prev) =>
                prev +
                `✅ Categories fetched successfully!
Found ${categories?.length || 0} categories:
${JSON.stringify(categories, null, 2)}

`,
            )
          }
        }
      } catch (fetchError) {
        setResult((prev) => prev + `❌ Fetch error: ${fetchError}\n`)
      }

      // Step 5: Test current user
      setResult((prev) => prev + "Step 5: Testing user session...\n")
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        setResult((prev) => prev + `User Error: ${userError.message}\n`)
      } else {
        setResult((prev) => prev + `Current user: ${user ? user.email : "Not logged in"}\n`)
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      setResult((prev) => prev + `❌ Connection test failed: ${error}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectFetch = async () => {
    setLoading(true)
    setResult("Testing direct fetch to Supabase...\n")

    try {
      const url = "https://gmlsrnjjkmgevblmvouk.supabase.co/rest/v1/categories?select=*"
      const response = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
          "Content-Type": "application/json",
        },
      })

      setResult(
        (prev) =>
          prev +
          `Direct fetch status: ${response.status}
Direct fetch status text: ${response.statusText}
`,
      )

      if (response.ok) {
        const data = await response.json()
        setResult(
          (prev) =>
            prev +
            `✅ Direct fetch successful!
Data: ${JSON.stringify(data, null, 2)}
`,
        )
      } else {
        const errorText = await response.text()
        setResult(
          (prev) =>
            prev +
            `❌ Direct fetch failed: ${errorText}
`,
        )
      }
    } catch (error) {
      setResult(
        (prev) =>
          prev +
          `❌ Direct fetch error: ${error}
`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? "Testing..." : "Test Supabase Client"}
            </Button>
            <Button onClick={testDirectFetch} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test Direct Fetch"}
            </Button>
          </div>

          {result && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap max-h-96">{result}</pre>
          )}

          <div className="text-sm text-gray-600 border-t pt-4">
            <p>
              <strong>Expected Configuration:</strong>
            </p>
            <p>Project URL: https://gmlsrnjjkmgevblmvouk.supabase.co</p>
            <p>Tables: categories, profiles, services</p>
            <p>Environment: v0 platform with pre-configured variables</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
