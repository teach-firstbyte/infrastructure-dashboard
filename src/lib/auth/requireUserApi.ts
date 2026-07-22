import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./getCurrentUser";

type UserApiResult = 
    | { user: User; error: null }
    | { user: null; error: NextResponse };

export async function requireUserApi(): Promise<UserApiResult> {
    const user = await getCurrentUser();
    if (!user) {
        return { user: null, error: NextResponse.json({ error: "Not authenticated" }, { status: 401 })};
    }
    return { user, error: null };
}