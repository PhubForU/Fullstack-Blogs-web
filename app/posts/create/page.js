"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    createPostAction,
    createSlug,
    doTitleExist,
    uploadImage,
} from "./action";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Create() {
    const [img, setImg] = useState(null);
    const [msg, setMsg] = useState("");
    const [desc, setDesc] = useState("");

    //zod schema for form
    const postSchema = z.object({
        title: z.string().min(1, { message: "please enter the title" }),
        // description: z.string().min(1, { message: "please enter description" }),
        category: z.string().min(1, { message: "please select category" }),
    });

    //assigning zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(postSchema) });

    //function to post data to database
    async function post(data) {
        if (desc == "") {
            setMsg("please enter description");
            return;
        }

        const titleExist = await doTitleExist(data.title);

        if (!titleExist) {
            const imageData = new FormData();
            imageData.append("image", img);
            const didUpload = await uploadImage(imageData);
            if (!didUpload) {
                setMsg("unable to upload image");
                return;
            }
            const postData = {
                title: data.title,
                description: desc,
                category: data.category,
                image: didUpload,
                slug: await createSlug(data.title),
            };
            const result = await createPostAction(postData);
            if (!result.success) {
                setMsg(result.message);
            } else {
                setMsg("created sucessfully");
            }
        } else {
            setMsg("title already exists");
        }
    }

    //tiptap rich text editor config
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>start your blog</p>",
        onUpdate({ editor }) {
            // setDesc(editor.getHTML());
            console.log(editor.getHTML());
        },
    });

    //jsx form
    return (
        <>
            <div className="w-full flex justify-center border-2">
                <form
                    onSubmit={handleSubmit(post)}
                    className="flex flex-col gap-2"
                >
                    <input
                        {...register("title")}
                        type="text"
                        placeholder="title"
                    />
                    {errors.title?.message && <p>{errors.title?.message}</p>}

                    {/* <input
                        {...register("description")}
                        type="text"
                        placeholder="description"
                    /> */}

                    <div>
                        <button
                            className={
                                editor?.isActive("bold")
                                    ? "bg-black text-white"
                                    : ""
                            }
                            onClick={() => {
                                editor.chain().focus().toggleBold().run();
                            }}
                        >
                            bold
                        </button>
                        <EditorContent editor={editor} />
                    </div>

                    <input
                        {...register("image")}
                        type="file"
                        name="image"
                        onChange={(e) => setImg(e.target.files[0])}
                        required={true}
                    />

                    <select {...register("category")}>
                        <option value="">-- select category --</option>
                        <option value="science">science</option>
                        <option value="general">general</option>
                        <option value="food">food</option>
                    </select>
                    {errors.category?.message && (
                        <p>{errors.category?.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-red-400 disabled:bg-slate-300"
                    >
                        submit
                    </button>
                    {msg && <p>{msg}</p>}
                </form>
            </div>
        </>
    );
}
