import { NextResponse } from "next/server";
import { Pool } from "pg";

// Create a single pool instance with SSL enabled for cloud Postgres
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
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
