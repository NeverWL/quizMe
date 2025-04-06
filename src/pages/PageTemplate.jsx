import { Link, useNavigate } from "react-router-dom";

export default function template() {
    return (
        <>
            <div> Template Page </div>
            <Link to="/QuizPage">Quiz Page</Link>
        </>
    )
};