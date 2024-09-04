import { Toaster } from "react-hot-toast";
import LogoutButton from "./logoutButton";
import { cookies } from "next/headers";
import Link from "next/link";
import { decrypt } from "../(lib)/sessions";

export default async function Header() {
    const token = cookies().get("session")?.value;
    const currentUser = await decrypt(token);
    return (
        <div className="h-[6svh] bg-[#0E1111] flex items-center text-white justify-between ">
            <Toaster position="bottom-center" reverseOrder={false} />

            <Link href={"/"}>
                <p className="font-semibold ml-4">Blogs.</p>
            </Link>

            {token ? (
                <div className="flex h-full mr-2 sm:mr-6 items-center gap-2 sm:gap-4 text-sm font-semibold">
                    <Link
                        href={`/user/${currentUser.id}`}
                        className="flex items-center gap-[10px] px-1 cursor-pointer"
                    >
                        <img
                            src="https://avatar.iran.liara.run/public/42"
                            alt="profile"
                            className="w-[33px]"
                        />
                        <div className="hover:underline">
                            Hi, {currentUser.name}
                        </div>
                    </Link>

                    <Link
                        href={"/create"}
                        className="px-[10px] py-[1.5px] rounded-sm cursor-pointer bg-white text-black"
                    >
                        write
                    </Link>

                    <div>
                        <LogoutButton />
                    </div>
                </div>
            ) : (
                // <div className="flex gap-5 mr-6">
                //     <div>
                //         <img
                //             src="https://avatar.iran.liara.run/public/42"
                //             alt="profile"
                //             className="w-[20px]"
                //         />
                //         <div>hey {currentUser?.name}</div>
                //     </div>
                //     <div className="bg-white text-[#333333] text-sm font-medium rounded-sm cursor-pointer flex items-center justify-center px-3">
                //         <Link href={"/create"}>Write</Link>
                //     </div>
                //     <LogoutButton />
                // </div>
                <Link
                    href={"/create"}
                    className="rounded-sm text-sm font-semibold bg-white text-black px-[14px] py-[3px] mr-6"
                >
                    write
                </Link>
            )}
        </div>
    );
}
