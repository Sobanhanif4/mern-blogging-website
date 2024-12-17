import PageAnimation from "../common/PageAnimation"
import InPageNavigation from "../components/InPageNavigation"

const HomePage = () => {
    return (
        <PageAnimation>
            <section className="h-cover flex justify-center gap-10">
                {/* Latest blog */}
                <div className="w-full" >


                    <InPageNavigation routes={["home", "trending"]} defaultHidden={["trending"]}>

                        <h1>Latest BLog</h1>
                        <h1>Trending BLog</h1>
                    </InPageNavigation>
                </div>

                {/* Filter and trending blog */}
                <div className="w-full">

                </div>

            </section>
            
        </PageAnimation>
    )
}

export default HomePage
