import { ItemActions } from "~/shadcn/components/ui/item"
import { Button } from "~/shadcn/components/ui/button"
import { Home, Map, User } from "lucide-react"

export function BottomNav() {
    return (
        <div className="flex w-full justify-center">
            <nav className="flex items-center gap-8 py-3">
                <Button
                    variant="ghost"
                    onClick={() => alert("navigation to /")}
                    >
                    <Home className=""/>
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => alert("navigation to /map")}
                    >
                    <Map className=""/>
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => alert("navigation to /profile")}
                    >
                    <User className=""/>
                </Button>
            </nav>
        </div>
    )
}