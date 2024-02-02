"use client";

import { usePathname } from "next/navigation";
import { kebabToTitle } from "@/lib/helpers";
import Link from "next/link";

export default function Navbar() {
    const pathname = kebabToTitle(usePathname());

    return (
        <div className="sticky flex items-center justify-between px-4 top-0 left-0 right-0 border-b-[2px] min-h-[52px] drop-shadow-sm">
            <p className="font-bold">
                {pathname !== "" ? `${pathname} - ` : ""}Kips Helper
            </p>
            {pathname ? <Link href="/">Home</Link> : null}
        </div>
    );
}
