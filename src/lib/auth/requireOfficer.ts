import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";
import { isOfficer } from "./roles";

export async function requireOfficer() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');
    if (!isOfficer(user)) redirect('/');
    return user;
}