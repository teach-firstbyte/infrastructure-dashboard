import { Role } from "@prisma/client";

const OFFICER_ROLES: Role[] = [Role.NORTHEASTERN_ADMIN, Role.SUPER_ADMIN];

export function isOfficer(user: { role: Role }) {
    return OFFICER_ROLES.includes(user.role);
}