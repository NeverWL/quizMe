import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <div> Home page </div>
            <Link to="/SelectPage">Select Page</Link>
        </>
    )
};