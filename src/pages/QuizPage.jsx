import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchQuestions = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            question: "What is the capital of France?",
            choices: ["Paris", "Berlin", "Rome", "Madrid"],
            answer: "Paris",
          },
          {
            question: "What is 2 + 2?",
            choices: ["3", "4", "5", "6"],
            answer: "4",
          },
        ]);
      }, 1000);
    });
  };

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchQuestions().then(setQuestions);
    }, []);
  
    const handleAnswer = (choice) => {
      if (choice === questions[current].answer) setScore((s) => s + 1);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        navigate("/ResultsPage", { state: { score: score + (choice === questions[current].answer ? 1 : 0), total: questions.length } });
      }
    };
  
    if (questions.length === 0) return <div className="p-4">Loading...</div>;
  
    const q = questions[current];
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{q.question}</h5>
            <div className="d-flex flex-column gap-2 mt-3">
              {q.choices.map((choice) => (
                <button key={choice} className="btn btn-outline-primary" onClick={() => handleAnswer(choice)}>
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //     <>
    //         <div> Quiz page </div>
    //         <Link to="/">Go Home</Link>
    //     </>
    // )
};