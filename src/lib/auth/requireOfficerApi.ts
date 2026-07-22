import { NextResponse } from "next/server";
import { getCurrentUser } from "./getCurrentUser";
import { isOfficer } from "./roles";
import { User } from "@prisma/client";

type OfficerApiResult = 
    | { user: User; error: null }
    | { user: null; error: NextResponse };

export async function requireOfficerApi(): Promise<OfficerApiResult> {
    const user = await getCurrentUser();

    if (!user) {
        return { user: null, error: NextResponse.json({ error: "Not authenticated" }, { status: 401 })};
    }
    if(!isOfficer(user)) {
        return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 })};
    }

    return { user, error: null };
}