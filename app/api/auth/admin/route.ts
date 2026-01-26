import { NextRequest, NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/firebase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const adminAuth = getAdminAuth()

    const decoded = await adminAuth.verifyIdToken(token)

    if (!decoded.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
