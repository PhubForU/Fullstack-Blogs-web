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
                            src={
                                currentUser.gender == "male"
                                    ? `https://api.dicebear.com/9.x/personas/svg?seed=${currentUser.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=shortCombover&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                                    : `https://api.dicebear.com/9.x/personas/svg?seed=${currentUser.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=bobBangs,bobCut,extraLong,long&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                            }
                            alt="profile"
                            className="w-[34px] rounded-full"
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
