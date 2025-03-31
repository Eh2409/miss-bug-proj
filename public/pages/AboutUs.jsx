export function AboutUs() {
    return <section className="about-us main-content">
        <h2>About Us</h2>
        <p>
            Miss Bug is a premier bug management platform designed to streamline the tracking and resolution of software issues.
            Our platform allows users to efficiently view, add, update, and delete bugs, ensuring a seamless debugging process.
            With a focus on innovation and quality, Miss Bug stands as the most advanced and reliable solution for managing software bugs.
        </p>

        <div className="site-action">
            <ul>
                <li>
                    <img src="assets/img/list-pixel.png" />
                    <span>View the list of bugs</span>
                </li>
                <li>
                    <img src="assets/img/bug-pixel.png" />
                    <span>Add and edit bugs</span>
                </li>
                <li>
                    <img src="assets/img/trash-pixel.png" />
                    <span>Remove bugs</span>
                </li>
            </ul>
        </div >
    </section >
}