import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import wordLess from '../assets/upGradeWordless.png';
import exportToFirestore from "../components/ExportToFireStore"; // Import the function

export default function QuizPage() {
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // OCR state
  const [imagePath, setImagePath] = useState("");
  const [studyGuide, setStudyGuide] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const textareaRef = useRef(null);
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const styles = {
    body: {
      background: "linear-gradient(to bottom, #503D3F, #2A1F21",
      color: "#FDE8E9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "0 1rem",
    },
    textBody: {
      border: "none",
      backgroundColor: "rgba(253, 232, 233, 0)",
      color: "#FDE8E9",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      width: "100%",
      maxWidth: "800px",
    },
    textBox: {
      border: "none",
      backgroundColor: "rgba(157, 155, 155, 0.37)",
      color: "#FFFFFF",
    },
    headerText: {
      color: "#FDE8E9",
      marginBottom: "1rem",
    },
    header: {
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    questionsText: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#FDE8E9"
    },
    navLink: {
      margin: "0 1rem",
      color: "#FDE8E9",
      fontWeight: "bold",
      textDecoration: "none",
    },
    activeLink: {
      borderBottom: "2px solid #ADDC92",
    },
    main: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    },
    card: {
      backgroundColor: "rgba(253, 232, 233, 0)",
      color: "#FDE8E9",
      borderRadius: "15px",
      padding: "2rem",
      width: "100%",
      maxWidth: "800px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    title: {
      color: "#FDE8E9",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    button: {
      backgroundColor: "#ADDC92",
      textDecoration: "none",
      color: "#FFFFFF",
      borderRadius: "20px",
      border: "nonex",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      margin: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#3D2E30",
      },
    },
    secondaryButton: {
      backgroundColor: "#ADDC92",
      textDecoration: "none",
      color: "#FFFFFF",
      borderRadius: "20px",
      border: "!px solid #503D3F",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      margin: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    input: {
      backgroundColor: "#FFFFFF",
      color: "#503D3F",
      border: "1px solid #503D3F",
      borderRadius: "10px",
      padding: "0.75rem",
      width: "100%",
      marginBottom: "1rem",
    },
    textarea: {
      backgroundColor: "#FFFFFF",
      color: "#503D3F",
      border: "1px solid #503D3F",
      borderRadius: "10px",
      padding: "0.75rem",
      width: "100%",
      minHeight: "200px",
      marginBottom: "1rem",
      resize: "vertical",
    },
    imagePreview: {
      maxWidth: "100%",
      maxHeight: "200px",
      borderRadius: "10px",
      margin: "1rem 0",
      border: "2px dashed #503D3F",
    },
    questionCard: {
      backgroundColor: "#FDE8E9",
      color: "#503D3F",
      borderRadius: "15px",
      padding: "2rem",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      textAlign: "center",
    },
    choiceButton: {
      backgroundColor: "#FFFFFF",
      color: "#503D3F",
      borderRadius: "10px",
      border: "2px solid #503D3F",
      padding: "0.75rem",
      margin: "0.5rem 0",
      width: "100%",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#ADDC92",
        borderColor: "#ADDC92",
      },
    },
    loading: {
      color: "#FDE8E9",
      textAlign: "center",
      fontSize: "1.2rem",
    },
    error: {
      color: "#FF6B6B",
      textAlign: "center",
      margin: "1rem 0",
    },
    footer: {
      color: "#FFFFFF",
      textAlign: "center",
      padding: "1rem",
    },
    // New styles for quiz feedback
    correctAnswer: {
      backgroundColor: "#ADDC92",
      borderColor: "#ADDC92",
      color: "#503D3F",
    },
    incorrectAnswer: {
      backgroundColor: "#FF6B6B",
      borderColor: "#FF6B6B",
      color: "#FDE8E9",
    },
    correctIndicator: {
      backgroundColor: "#ADDC92",
      color: "#503D3F",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      margin: "1rem 0",
      fontWeight: "bold",
    },
    incorrectIndicator: {
      backgroundColor: "#FF6B6B",
      color: "#FDE8E9",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      margin: "1rem 0",
      fontWeight: "bold",
    },
    feedback: {
      backgroundColor: "#FDE8E9",
      color: "#503D3F",
      padding: "1rem",
      borderRadius: "10px",
      borderLeft: "4px solid #503D3F",
      margin: "1rem 0",
    },
    buttonGroup: {
      display: "flex",
      marginTop: "2rem",
      marginLeft: "65%"
    },
    selectedAnswer: {
      backgroundColor: "#503D3F",
      color: "#FDE8E9",
      borderColor: "#503D3F",
    }
  };

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
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    });
  };

  // Handle question count input
  const handleQuestionCountChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setQuestionCount('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue >= 1 && numValue <= 20) {
        setQuestionCount(numValue);
      }
    }
  };

  // Generate quiz from study guide
  const generateQuiz = async () => {
    if (!studyGuide.trim()) {
      setError("Please provide a study guide");
      return;
    }

    if (!questionCount || questionCount < 1 || questionCount > 20) {
      setError("Please enter a valid number of questions (1-20)");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest"
      });
      
      const prompt = `
      Given the following study guide, generate a ${questionCount}-question multiple choice quiz.
      For each question, provide:
      - A clear question related to the study material
      - 4 plausible answer choices (a, b, c, d)
      - The correct answer
      - A brief explanation of why the answer is correct
      
      Format each question like this:
      {
        "question": "What is the capital of France?",
        "choices": ["Paris", "Berlin", "Rome", "Madrid"],
        "answer": "Paris",
        "explanation": "Paris has been the capital of France since the 5th century."
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
      setSelectedAnswer(null);
      setIsSubmitted(false);

      console.log(user);

      //Firestore
      const userId = "USER_ID"; // Replace with actual user ID
      exportToFirestore(userId, generatedQuestions);

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Modified answer selection handler
  const handleAnswerSelect = (choice) => {
    if (!isSubmitted) {
      setSelectedAnswer(choice);
    }
  };

  // New submit answer handler
  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsSubmitted(true);
    
    if (selectedAnswer === questions[current].answer) {
      setScore(score + 1);
    }
  };

  // New next question handler
  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      navigate("/ResultsPage", { 
        state: { 
          score: score, 
          total: questions.length 
        } 
      });
    }
  };

  // Reset quiz handler
  const handleNewQuiz = () => {
    setQuestions([]);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  if (isLoading) return <div style={styles.loading}>Generating quiz questions...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Up-Grade</h3>
        </div>
        <nav>
          <Link to="/quizMe" style={styles.navLink}>Home</Link>
          <Link to="/QuizPage" style={{ ...styles.navLink, ...styles.activeLink }}>Create a Quiz</Link>
        </nav>
      </header>

      <main style={styles.main}>
        {questions.length === 0 ? (
          // Study guide input section
          <div style={styles.textBody}>
            
            <div style={{ marginBottom: "2rem" }}>
              <h6 style={styles.headerText}>Upload Study Material Image</h6>
              <input 
                type="file" 
                onChange={handleImageChange} 
                style={{ display: "none" }}
                id="imageUpload"
                accept="image/*"
              />
              <label htmlFor="imageUpload" style={styles.button}>
                Choose Image
              </label>
              {imagePath && (
                <>
                  <img src={imagePath} style={styles.imagePreview} alt="Uploaded study material"/>
                  <button 
                    onClick={handleExtractText} 
                    style={styles.button}
                    disabled={isExtracting}
                  >
                    {isExtracting ? "Extracting..." : "Extract Text"}
                  </button>
                </>
              )}
            </div>
            
            <div style={{ marginBottom: "2rem" }}>
              <h6 style={styles.headerText}>Or Enter Study Guide Text</h6>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                value={studyGuide}
                onChange={(e) => setStudyGuide(e.target.value)}
                placeholder="Paste your study guide here or extract from image above..."
              />
            </div>
            
            <div style={{ marginBottom: "2rem" }}>
              <label style={styles.questionsText}>
                Number of Questions (1-20):
              </label>
              <input
                type="number"
                style={{ ...styles.input, width: "80px", textAlign: "center" }}
                min="1"
                max="20"
                value={questionCount || ''}
                onChange={handleQuestionCountChange}
              />
            </div>
            
            <div style = {{marginBottom: "2rem", }}>
            <button 
              onClick={generateQuiz} 
              style={styles.secondaryButton}
              disabled={!studyGuide.trim() || isExtracting || !questionCount}
            >
              Generate {questionCount} Question{questionCount !== 1 ? 's' : ''}
            </button>
            </div>
          </div>
        ) : (
          // Updated Quiz interface
          <div style={styles.questionCard}>
            <h2 style={{ color: "#503D3F", marginBottom: "1rem" }}>
              Question {current + 1} of {questions.length}
              {isSubmitted && (
                <span style={{ 
                  float: "right",
                  color: selectedAnswer === questions[current].answer ? "#ADDC92" : "#FF6B6B"
                }}>
                  {selectedAnswer === questions[current].answer ? "✓ Correct" : "✗ Incorrect"}
                </span>
              )}
            </h2>
            
            <h3 style={{ color: "#503D3F", marginBottom: "2rem" }}>{questions[current].question}</h3>
            
            <div style={{ width: "100%" }}>
              {questions[current].choices.map((choice) => {
                let buttonStyle = styles.choiceButton;
                
                if (isSubmitted) {
                  if (choice === questions[current].answer) {
                    buttonStyle = { ...buttonStyle, ...styles.correctAnswer };
                  } else if (choice === selectedAnswer && choice !== questions[current].answer) {
                    buttonStyle = { ...buttonStyle, ...styles.incorrectAnswer };
                  }
                } else if (choice === selectedAnswer) {
                  buttonStyle = { ...buttonStyle, ...styles.selectedAnswer };
                }
                
                return (
                  <button 
                    key={choice} 
                    style={buttonStyle}
                    onClick={() => handleAnswerSelect(choice)}
                    disabled={isSubmitted}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            
            {isSubmitted && (
              <div style={styles.feedback}>
                {selectedAnswer === questions[current].answer ? (
                  <>
                    <div style={styles.correctIndicator}>Correct! Well done!</div>
                    <div style={{ marginTop: "0.5rem" }}>
                      {questions[current].explanation || "Good Job!"}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.incorrectIndicator}>
                      Incorrect. The correct answer is: {questions[current].answer}
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      {questions[current].explanation || "Review this concept and try again."}
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div style={styles.buttonGroup}>
              {!isSubmitted ? (
                <button 
                  onClick={handleSubmit} 
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  onClick={handleNext} 
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  {current + 1 < questions.length ? "Next Question" : "See Results"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/*<footer style={styles.footer}>
        <p>
          Project by Daniel M., Zheng C., Donovan T., and Jared L.
        </p>
      </footer>*/}
    </div>
  );
}