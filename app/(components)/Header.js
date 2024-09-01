import { Toaster } from "react-hot-toast";
import LogoutButton from "./logoutButton";
import { cookies } from "next/headers";
import Link from "next/link";
import { decrypt } from "../(lib)/sessions";

export default async function Header() {
    const token = cookies().get("session")?.value;
    const currentUser = await decrypt(token);
    return (
        <div className="h-[6svh] bg-[#0E1111] flex items-center text-white justify-between">
            <Toaster position="bottom-center" reverseOrder={false} />
            <Link href={"/"}>
                <p className="font-semibold ml-4">Blogs.</p>
            </Link>
            {token ? (
                <div className="flex gap-3">
                    <p>hey {currentUser?.name}</p>
                    <Link href={"/create"}>
                        <div className="bg-white text-[#333333] text-sm font-medium rounded-sm cursor-pointer flex items-center justify-center px-3">
                            Write
                        </div>
                    </Link>
                    <LogoutButton />
                </div>
            ) : (
                <>
                    <Link href={"/login"}>
                        <button className="mr-3 px-3 py-[1.5px] rounded-sm text-[14px] font-medium cursor-pointer bg-white text-black">
                            login
                        </button>
                    </Link>
                </>
            )}
        </div>
    );
}
