import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const studyGuide = `
  Unit 1 Study Guide
  Treaty of Tordesillas- Columbus has just finished his voyage to the Americas in the name of Spain. This treaty divided the Western Hemisphere between Spain and Portugal.
  Columbian Exchange- great discoveries of plants and animals had been discovered by Columbus; they were new to Europe and Africa. Ships took items such as corn, potatoes, and tobacco from America to Europe and Africa. From these countries, they brought back livestock, grains, fruit, and coffee.
  Middle Passage- The triangular trade: merchants carrying rum and other goods from New England colonies exchanged their merchandise for enslaved Africans across the Atlantic Ocean. The middle passage is the voyage that brought Africans to the West Indies (North America), this trip had the most hostile conditions.
  Stamp Act- during the beginning of the Revolution. 1765 imposed a tax on documents and printed items. A stamp marked that the tax had been paid. 1766 merchants got the act repealed. By 1767 the parliament passed the declaratory act which gave them control over the colonies in America no matter what.
  Northwest Ordinance - articles of confederation- the plan established a form of government called
  `;

  useEffect(() => {
    async function generateQuiz() {
      try {
        setIsLoading(true);
        setError(null);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash-latest"
        });
        
        const prompt = `
        Given the following study guide, please generate a quiz that encompasses all topics mentioned. 
        Create 5 high-quality multiple choice questions. For each question, provide:
        - A clear question
        - 4 plausible answer choices (a, b, c, d)
        - The correct answer
        
        Format each question exactly like this:
        {
          "question": "What is the capital of France?",
          "choices": ["Paris", "Berlin", "Rome", "Madrid"],
          "answer": "Paris"
        }
        
        Return only a valid JSON array of these question objects.
        
        Study Guide:
        ${studyGuide}
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response and parse as JSON
        const cleanedResponse = text.replace(/```json|```/g, '').trim();
        const generatedQuestions = JSON.parse(cleanedResponse);
        
        setQuestions(generatedQuestions);
      } catch (err) {
        console.error("API Error Details:", err);
        setError(err.message || "Failed to generate quiz");
      } finally {
        setIsLoading(false);
      }
    }

    generateQuiz();
  }, [apiKey]);

  const handleAnswer = (choice) => {
    if (choice === questions[current].answer) {
      setScore(score + 1);
    }
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      navigate("/ResultsPage", { 
        state: { 
          score: choice === questions[current].answer ? score + 1 : score, 
          total: questions.length 
        } 
      });
    }
  };

  if (isLoading) return <div className="p-4">Generating quiz questions...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;
  if (questions.length === 0) return <div className="p-4">No questions generated</div>;

  const currentQuestion = questions[current];
  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Question {current + 1} of {questions.length}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{currentQuestion.question}</h6>
          <div className="d-flex flex-column gap-2 mt-3">
            {currentQuestion.choices.map((choice) => (
              <button 
                key={choice} 
                className="btn btn-outline-primary" 
                onClick={() => handleAnswer(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <Link to="/" className="btn btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}