import { Button } from "~/shadcn/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/shadcn/components/ui/card"
import { Input } from "~/shadcn/components/ui/input"
import { Label } from "~/shadcn/components/ui/label"

import { FaGoogle } from "react-icons/fa";

export function LoginCard() {
    return (
        <Card className="w-full max-w-sm max-h-3/4">
            <CardHeader className="justify-center text-xl">
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Login
                </Button>
                <Button variant="outline" className="w-full">
                    <FaGoogle /> Continue with Google
                </Button>
                <Button variant="outline" className="w-full">
                    Sign up
                </Button>
            </CardFooter>
        </Card>
    )
}
