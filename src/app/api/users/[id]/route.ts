import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request : Request,
    { params } : { params: {id : string }}
) {

    try {
        // get user ID
        const userId = parseInt(params.id);

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