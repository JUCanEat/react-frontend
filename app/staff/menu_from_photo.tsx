import * as React from "react"

import { TopBar } from "~/components/staff/top_bar"
import { BottomNav } from "~/components/staff/bottom_nav"
import { StaffMenuFromPhoto } from "~/components/staff/menu_from_photo"

export function StaffMenuFromPhotoComponent() {
    return (
        <div className="bg-black min-h-screen w-full">
            <TopBar />

            <div className="w-full overflow-y-auto pb-[120px]">
                <StaffMenuFromPhoto />
            </div>

            <BottomNav />
        </div>
    )
}
