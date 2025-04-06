import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";

export default function QuizPage() {
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // OCR state
  const [imagePath, setImagePath] = useState("");
  const [studyGuide, setStudyGuide] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const textareaRef = useRef(null);
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Handle image upload
  const handleImageChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };

  // Extract text from image
  const handleExtractText = () => {
    setIsExtracting(true);
    Tesseract.recognize(
      imagePath,
      "eng",
      { logger: (m) => console.log(m) }
    )
    .catch((err) => {
      console.error("OCR Error:", err);
      setError("Failed to extract text from image");
    })
    .then((result) => {
      setStudyGuide(result.data.text);
      setIsExtracting(false);
      // Auto-focus the textarea after extraction
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    });
  };

  // Generate quiz from study guide
  const generateQuiz = async () => {
    if (!studyGuide.trim()) {
      setError("Please provide a study guide");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash"
      });
      
      const prompt = `
      Given the following study guide, generate a 5-question multiple choice quiz.
      For each question, provide:
      - A clear question
      - 4 plausible answer choices (a, b, c, d)
      - The correct answer
      
      Format each question like this:
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
      
      const cleanedResponse = text.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(cleanedResponse);
      
      setQuestions(generatedQuestions);
      setCurrent(0);
      setScore(0);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quiz answer selection
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

  // Render different states
  if (isLoading) return <div className="p-4">Generating quiz questions...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div className="container py-4">
      {questions.length === 0 ? (
        // Study guide input section
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create Study Guide</h5>
            
            {/* Option 1: Upload image for OCR */}
            <div className="mb-4">
              <h6>Upload Study Material Image</h6>
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="form-control mb-2"
                accept="image/*"
              />
              {imagePath && (
                <>
                  <img src={imagePath} className="img-fluid mb-2" alt="Uploaded study material"/>
                  <button 
                    onClick={handleExtractText} 
                    className="btn btn-primary"
                    disabled={isExtracting}
                  >
                    {isExtracting ? "Extracting..." : "Extract Text"}
                  </button>
                </>
              )}
            </div>
            
            {/* Option 2: Direct text input */}
            <div className="mb-3">
              <h6>Or Enter Study Guide Text</h6>
              <textarea
                ref={textareaRef}
                className="form-control"
                rows="10"
                value={studyGuide}
                onChange={(e) => setStudyGuide(e.target.value)}
                placeholder="Paste your study guide here or extract from image above"
              />
            </div>
            
            <button 
              onClick={generateQuiz} 
              className="btn btn-success"
              disabled={!studyGuide.trim() || isExtracting}
            >
              Generate Quiz
            </button>
          </div>
        </div>
      ) : (
        // Quiz interface
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Question {current + 1} of {questions.length}</h5>
            <h6 className="card-subtitle mb-2">{questions[current].question}</h6>
            <div className="d-flex flex-column gap-2 mt-3">
              {questions[current].choices.map((choice) => (
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
              <button 
                onClick={() => setQuestions([])} 
                className="btn btn-secondary"
              >
                Create New Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3">
        <Link to="/" className="btn btn-outline-secondary">Go Home</Link>
      </div>
    </div>
  );
}