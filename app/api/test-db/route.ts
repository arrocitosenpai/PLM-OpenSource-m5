import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize connection pool using the DATABASE_URL from Vercel env
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Run a very simple query just to test connectivity
    const result = await db.query("SELECT NOW()");
    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      time: result.rows[0].now,
    });
  } catch (error: any) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
