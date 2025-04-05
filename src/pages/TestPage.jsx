import { Link } from "react-router-dom";

export default function TestPage() {
    //Do whatever you want here
    const hi = 0;
    return (
        <>
            <div> Test Page </div>
            <div> {hi} </div>
            <Link to="/">Go Home</Link>
        </>
    )
};