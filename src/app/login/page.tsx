import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signUp, logIn } from "./actions"
import { GoogleButton } from "./GoogleButton"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="text-center mb-8">
        <Image
          src="/FirstByteBitex4.png"
          alt="FirstByte"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold">FirstByte Dashboard</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Use your email, or sign up if you&apos;re new.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
              {error}
            </div>
          )}

        <GoogleButton />
        <div className="my-4 text-center text-sm text-muted-foreground">or</div>
          <form className="space-y-3">
            <Input name="email" type="email" placeholder="Email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={6}
            />
            <Input name="name" type="text" placeholder="Full name (signup only)" />

            <div className="flex gap-2 pt-2">
              <Button formAction={logIn} className="flex-1">
                Log In
              </Button>
              <Button formAction={signUp} variant="secondary" className="flex-1">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}