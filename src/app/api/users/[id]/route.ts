import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets a single user by id, including their team memberships.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                teamMemberships: {
                    include: { team: true },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
    }
}

/**
 * Updates a user's name and/or email.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const { name, email } = await request.json();

        if (name === undefined && email === undefined) {
            return NextResponse.json(
                { error: "Provide at least one of: name, email" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // email is unique — reject if another user already has it
        if (email !== undefined && email !== existingUser.email) {
            const emailOwner = await prisma.user.findUnique({ where: { email } });
            if (emailOwner) {
                return NextResponse.json(
                    { error: "A user with that email already exists" },
                    { status: 409 }
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(email !== undefined ? { email } : {}),
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request : Request,
    { params } : { params: Promise<{ id : string }> }
) {

    try {
        // get user ID
        const { id } = await params;
        const userId = parseInt(id);

        //check that the ID is a number 
        if (isNaN(userId)) {
            //throw an error if ID is not a number 
            return NextResponse.json(
                { error: 'Invalid user ID' }, 
                { status: 400 });
        }

        //now that we have verified the ID is a number, we need to check that 
        // the user being deleted exists in the database
        const existingUser = await prisma.user.findUnique({
            where : {
                id : userId
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' }, 
                { status: 404 });
        }

        //now that we know the ID is a number and the user belonging to that ID exists, we can delete the user
        const deletedUser = await prisma.user.delete({
            where: {id : userId}
        })

        return NextResponse.json( 
        {
            message: 'User deleted successfully',
            user: deletedUser
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json( 
            {
                error: 'Failed to delete user'
            }, 
            {
                status: 500
            }
        );
    }
}  