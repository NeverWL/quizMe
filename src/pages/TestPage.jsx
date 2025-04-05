import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function TestPage() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
          model: "gemini-1.5-flash-latest" // Updated model name
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
        const questions = JSON.parse(cleanedResponse);
        
        setQuizQuestions(questions);
      } catch (err) {
        console.error("API Error Details:", err);
        setError(err.message || "Failed to generate quiz");
      } finally {
        setIsLoading(false);
      }
    }

    generateQuiz();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Study Guide Quiz</h1>
      <Link to="/" style={{ display: "block", marginBottom: "20px" }}>
        Go Home
      </Link>
      
      {isLoading ? (
        <div>Generating quiz questions...</div>
      ) : error ? (
        <div style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div>
          <h2>Generated Quiz Questions:</h2>
          {quizQuestions.map((q, index) => (
            <div key={index} style={{ 
              margin: "20px 0", 
              padding: "15px", 
              border: "1px solid #ddd",
              borderRadius: "5px"
            }}>
              <h3>Question {index + 1}: {q.question}</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {q.choices.map((choice, i) => (
                  <li key={i} style={{ 
                    padding: "8px",
                    backgroundColor: choice === q.answer ? "#e6f7e6" : "white",
                    border: choice === q.answer ? "1px solid #4CAF50" : "1px solid #ddd",
                    margin: "5px 0",
                    borderRadius: "4px"
                  }}>
                    {String.fromCharCode(97 + i)}) {choice}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}