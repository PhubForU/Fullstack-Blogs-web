import { notFound, redirect } from "next/navigation";
import { getPostDetails } from "./action";
import UpdateForm from "./form";
import { decrypt } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";

export default async function UpdatePost({ params }) {
    const post = await getPostDetails(params.id);
    if (!post.success) {
        return notFound();
    }
    const user = await decrypt(cookies().get("session")?.value);
    if (post.authorId != user.id) {
        redirect(`/posts/${post.slug}`);
    }
    return <UpdateForm postData={post} />;
}
