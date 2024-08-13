import { Toaster } from "react-hot-toast";
import LogoutButton from "./logoutButton";
import { cookies } from "next/headers";
import { deleteSession } from "../(lib)/sessions";
import { revalidatePath } from "next/cache";

export default function Header() {
    return (
        <div className="h-[6svh] bg-black flex items-center text-white justify-between">
            <Toaster position="bottom-center" reverseOrder={false} />
            Header.
            {cookies().get("session")?.value ? <LogoutButton /> : ""}
        </div>
    );
}
