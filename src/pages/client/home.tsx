import AuthorNavbar from "@/components/client/home/NavbarAuthor/author.navbar";
import CategorySidebar from "@/components/client/home/NavBarCategory/category.index";
import SliderImage from "@/components/client/home/Slider/slider";

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="main-content">
                {/* Left sidebar */}
                <div className="left-side">
                    <CategorySidebar />
                    <AuthorNavbar/>
                </div>

                {/* Right content */}
                {/* <div className="right-side">
                    <MainBanner />
                    <FlashDeal />
                </div> */}
                <div className="center-side">
                    <SliderImage/>
                </div>
            </div>
        </div>
    )
}
export default HomePage;