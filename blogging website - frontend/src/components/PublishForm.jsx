import { useContext } from "react"
import { EditorContext } from "../pages/EditorPages"
import { Toaster } from "react-hot-toast"
import PageAnimation from "../common/PageAnimation"


const PublishForm = () => {

    let characterLimit = 200;

    let { blog, blog: { banner, title, tags, des }, setEditorState, setBlog } = useContext(EditorContext)

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;

        setBlog({ ...blog, title: input.value })
    }

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value })
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };
    return (
        <PageAnimation>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}
                >

                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
                        {title}
                    </h1>

                    <p className="font-gelasio line-clamp-4 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">

                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4"
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>

                    <textarea
                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleBlogDesChange}
                    ></textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {characterLimit - des.length} character left
                    </p>
                </div>
            </section>
        </PageAnimation>
    )
}

export default PublishForm
