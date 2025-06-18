"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnection() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // Test 1: Check if we can connect
      console.log("Testing Supabase connection...")
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("Anon Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Test 2: Try to fetch categories
      const { data: categories, error: categoriesError } = await supabase.from("categories").select("*")

      if (categoriesError) {
        setResult(`Categories Error: ${categoriesError.message}`)
        console.error("Categories error:", categoriesError)
        return
      }

      // Test 3: Try to get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("User error:", userError)
      }

      setResult(`✅ Connection successful!
Categories found: ${categories?.length || 0}
Current user: ${user ? user.email : "Not logged in"}
Categories: ${JSON.stringify(categories, null, 2)}`)
    } catch (error) {
      console.error("Connection test failed:", error)
      setResult(`❌ Connection failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Connection"}
          </Button>

          {result && <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">{result}</pre>}

          <div className="text-sm text-gray-600">
            <p>
              <strong>Environment Check:</strong>
            </p>
            <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
