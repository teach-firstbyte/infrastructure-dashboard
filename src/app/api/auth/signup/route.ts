import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        //get request info
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

    if (error || !data.user) {
  return NextResponse.json(
    { error: error?.message || "Failed to create user in auth system" },
    { status: 500 }
  );
}

        try {
        await prisma.user.create({
            data: {
                email,
                name,
                role: "STUDENT"
            }
        });
            
         return NextResponse.json(
      { message: "User created! Check your email to confirm." },
      { status: 201 }
    );
        }
        catch(err){
            return NextResponse.json({ error: "Failed to create user in database: " + err}, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to sign up user" }, { status: 500 });
    }
}

