import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import PageAnimation from "../common/PageAnimation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/EditorPages";
import EditorJS from "@editorjs/editorjs"
import { tools } from "./Tools";

const BlogEditor = () => {
    let { blog = {}, setBlog } = useContext(EditorContext);
    let { title = "", banner = "", content = "", tags = [], des = "" } = blog;

    useEffect(() => {

        let editor = new EditorJS({
            holderId: "textEditor",
            data: '',
            tools: tools,
            placeholder: "Lets write an awsome story"
        })

    }, [])

    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...");
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.success("Uploaded!");
                        toast.dismiss(loadingToast);
                        setBlog({ ...blog, banner: url });
                    }
                })
                .catch((err) => {
                    toast.dismiss(loadingToast);
                    toast.error(err.message || "Upload failed!");
                });
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    };

    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} alt="Logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title?.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">Publish</button>
                    <button className="btn-light py-2">Draft</button>
                </div>
            </nav>
            <Toaster />
            <PageAnimation>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={banner || defaultBanner}
                                    className="z-20"
                                    onError={handleError}
                                    alt="Blog Banner"
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                        <textarea
                            placeholder="Blog title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder-opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>
                        <hr className="w-full opacity-10 my-5"/>

                        <div className="font-gelasio" id="textEditor"></div>
                    </div>
                </section>
            </PageAnimation>
        </>
    );
};

export default BlogEditor;
