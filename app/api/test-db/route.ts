import { NextResponse } from "next/server";
import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // allow self-signed certs (Supabase)
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
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
