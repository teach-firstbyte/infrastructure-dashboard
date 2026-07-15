import { createHmac } from "crypto";

/**
 * Generates a check in code for a meeting to mark attendance.
 * 
 * @param meetingId the meeting id.
 */
export function generateCheckInCode(meetingId: number) : string {
    const secret = process.env.CHECKIN_SECRET;
    if(!secret) {
        throw new Error("CHECKIN_SECRET is not set");
    }
    
    const fullHash = createHmac("sha256", secret)
        .update(String(meetingId))
        .digest("hex");

    return fullHash.slice(0, 6).toUpperCase();
}

/**
 * Verifys the check-in code for a specific meeting to mark attendance.
 * 
 * @param meetingId the meeting id
 * @param code the check-in code
 */
export function verifyCheckInCode(meetingId: number, code: string): boolean {
    const expected = generateCheckInCode(meetingId);
    return expected === code.trim().toUpperCase();
}