import { Grid, Utensils, Settings } from "lucide-react"
import { Button } from "~/shadcn/components/ui/button"

export function BottomNav() {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex h-[70px] w-[300px] items-center justify-center rounded-[20px] bg-[#1B1B1B] shadow-xl">
                <nav className="flex items-center gap-12">
                    <button onClick={() => console.log("clicked")}>
                        <Grid className="h-6 w-6 text-white" />
                    </button>

                    <button onClick={() => (window.location.href = "/staff/menu-from-photo")}>
                        <Utensils className="h-6 w-6 text-[#009DE0]" />
                    </button>

                    <button onClick={() => console.log("clicked")}>
                        <Settings className="h-6 w-6 text-white" />
                    </button>
                </nav>
            </div>
        </div>
    )
}

