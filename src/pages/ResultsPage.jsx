import { useLocation, useNavigate } from "react-router-dom";


export default function ResultsPage() {

    const { state } = useLocation();
    const navigate = useNavigate();
  
    return (
      <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-3">Your Score: {state.score} / {state.total}</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/quizMe")}>Back to Home</button>
      </div>
    );
    // return (
    //     <>
    //         <div> Select page </div>
    //         <Link to="/QuizPage">Quiz Page</Link>
    //     </>
    // )
};