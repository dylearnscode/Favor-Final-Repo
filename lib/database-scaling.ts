// Database scaling configuration for Supabase

export const databaseScalingOptions = {
  // Free tier - up to 500MB storage, 2 connections
  free: {
    maxConnections: 2,
    storage: "500MB",
    cost: "$0/month",
    maxUsers: "~1,000",
    limitations: "Limited connections, no dedicated resources",
  },

  // Pro tier - up to 8GB storage, 15 connections
  pro: {
    maxConnections: 15,
    storage: "8GB",
    cost: "$25/month",
    maxUsers: "~10,000",
    limitations: "Shared resources, good for small to medium apps",
  },

  // Team tier - up to 100GB storage, 50 connections
  team: {
    maxConnections: 50,
    storage: "100GB",
    cost: "$599/month",
    maxUsers: "~40,000+",
    limitations: "Dedicated resources, good for production apps",
  },

  // Enterprise tier - custom storage, custom connections
  enterprise: {
    maxConnections: "Custom",
    storage: "Custom",
    cost: "Custom pricing",
    maxUsers: "Unlimited",
    limitations: "No limitations, fully customizable",
  },
}

// Database optimization recommendations
export const databaseOptimizations = [
  {
    name: "Add indexes for frequently queried columns",
    sql: `
      -- Add index for category searches
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
      
      -- Add index for user searches
      CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
      
      -- Add index for service status
      CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
      
      -- Add composite index for category and subcategory
      CREATE INDEX IF NOT EXISTS idx_services_category_subcategory ON services(category, subcategory);
      
      -- Add index for transaction status
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
    `,
  },
  {
    name: "Set up Row Level Security (RLS) policies",
    sql: `
      -- Example RLS policy for services table
      CREATE POLICY "Users can view active services" 
      ON services FOR SELECT 
      USING (status = 'active');
      
      CREATE POLICY "Users can insert their own services" 
      ON services FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own services" 
      ON services FOR UPDATE 
      USING (auth.uid() = user_id);
    `,
  },
  {
    name: "Set up database caching",
    description: "Use Supabase's built-in caching or implement application-level caching for frequently accessed data.",
  },
  {
    name: "Implement connection pooling",
    description:
      "Use pgBouncer for connection pooling to handle more concurrent users with fewer database connections.",
  },
  {
    name: "Set up database replication",
    description:
      "For high availability and read scaling, set up database replication (available on Team and Enterprise plans).",
  },
]

// Recommended plan for 40K users
export const recommendedPlan = {
  plan: "team",
  reasoning:
    "The Team plan provides sufficient connections and storage for 40K users with dedicated resources for optimal performance.",
  estimatedCost: "$599/month",
  additionalRecommendations: [
    "Implement all suggested database optimizations",
    "Set up proper caching strategies",
    "Consider using Edge Functions for API routes to reduce database load",
    "Monitor database performance and scale as needed",
  ],
}
