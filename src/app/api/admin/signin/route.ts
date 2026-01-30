import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

// Sign in the user with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // get user details from the database
        const user = await prisma.user.findUnique({
            where: {
                email: data.user.email,
                role: UserRole.ADMIN
            }
        });

        if (!user) {
            //TODO: if user is not in db but in auth, do something? is that possible..
            return NextResponse.json({ error: "User not found in database" }, { status: 404 });
        }

        return NextResponse.json(
            {
                message: "Sign-in successful",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Failed to sign in user" }, { status: 500 });
    }
}