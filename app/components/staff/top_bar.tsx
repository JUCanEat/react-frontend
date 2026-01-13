import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "~/shadcn/components/ui/item"

export function TopBar() {
    return (
        <div className="flex w-full max-w-full flex-col gap-3 bg-black">
            <Item
                variant="outline"
                size="xsm"
                width="default"
                className="justify-between border-none bg-black py-2"
            >
                <div className="flex items-center gap-2">

                    <ItemMedia
                        variant="logo"
                        className="mt-[2px]"
                        onClick={() => (window.location.href = "/")}
                    >
                        <img
                            src="/logo_white.svg"
                            alt="JU Can Eat logo"
                            className="h-7"
                        />
                    </ItemMedia>

                </div>
                <div></div>
            </Item>
        </div>
    )
}
