import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
      <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4">Welcome to Up-Grade!</h1>
        <button className="btn btn-primary" onClick={() => navigate("/SelectPage")}>Upload Study Materials</button>
        <Link to="/TestPage">Test Page</Link>
        <Link to="/OCRPage">OCR Page</Link>
      </div>
    );
    // return ( a
    //     <>
    //         <div> Home page </div>
    //         <Link to="/SelectPage">Select Page</Link>
    //     </>
    // )
};

