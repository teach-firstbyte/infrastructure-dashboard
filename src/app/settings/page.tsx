import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { NameForm } from "./NameForm";
import { PasswordForm } from "./PasswordForm";
import { BackLink } from "@/components/BackLink";

export default async function UserSettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login')
    
    return (
        <div className="container mx-auto p-6 space-y-6">
            <BackLink />
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <NameForm currentName={user.name} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <PasswordForm />
                </CardContent>
            </Card>
        </div>
    );
}