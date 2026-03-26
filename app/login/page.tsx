import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import Link from "next/link"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  async function login(formData: FormData) {
    "use server"

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      })
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(`/login?error=no_account`)
      }
      throw error
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>

        {searchParams.error === "no_account" && (
          <p className="text-sm text-red-500 text-center">
            No account found or incorrect password.{" "}
            <Link href="/register" className="underline font-medium">
              Sign up
            </Link>{" "}
            to create one.
          </p>
        )}

        <form action={login} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
