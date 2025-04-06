import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import wordLess from '../assets/upGradeWordless.png';
import { FiUpload, FiFileText, FiImage, FiX } from "react-icons/fi";
import exportToFirestore from "../components/ExportToFireStore";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
  // Quiz state
  const { user } = useAuth();
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
      background: "linear-gradient(to bottom, #503D3F, #2A1F21)",
      color: "#FDE8E9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "0 1rem",
    },
    body2: {
      background: "linear-gradient(to bottom, #503D3F, #2A1F21)",
      maxHeight: "100vh",
      maxWidth: "100vw",
      display: "flex",
      flexDirection: "column",
      padding: "0 1rem",
      margin: "0",
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
    uploadCard: {
      backgroundColor: "rgba(253, 232, 233, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(253, 232, 233, 0.2)",
      borderRadius: "15px",
      padding: "2rem",
      width: "100%",
      maxWidth: "800px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      marginBottom: "2rem",
    },
    uploadSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: imagePath ? "1rem" : "2rem",
      border: imagePath ? "none" : "2px dashed rgba(253, 232, 233, 0.3)",
      borderRadius: "10px",
      marginBottom: "1.5rem",
      transition: "all 0.3s ease",
      backgroundColor: imagePath ? "transparent" : "rgba(253, 232, 233, 0.05)",
      minHeight: imagePath ? "auto" : "200px",
      justifyContent: "center",
      width: "100%"
    },
    uploadIcon: {
      fontSize: "2.5rem",
      color: "#ADDC92",
      marginBottom: "1rem",
    },
    uploadText: {
      color: "#FDE8E9",
      marginBottom: "1rem",
      textAlign: "center",
    },
    uploadButton: {
      backgroundColor: "#ADDC92",
      color: "#503D3F",
      borderRadius: "20px",
      border: "none",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.3s ease",
    },
    textSection: {
      marginTop: "2rem",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#FDE8E9",
      marginBottom: "1rem",
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
      border: "none",
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
      border: "1px solid #503D3F",
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
    imagePreviewContainer: {
      position: "relative",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center"
    },
    imagePreview: {
      maxWidth: "100%",
      maxHeight: "300px",
      borderRadius: "10px",
      objectFit: "contain",
      background: "rgba(0,0,0,0.1)",
      padding: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 10,
      "&:hover": {
        background: "rgba(0,0,0,0.9)"
      }
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
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footer: {
      color: "#FFFFFF",
      textAlign: "center",
      padding: "1rem",
    },
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
    },
    divider: {
      display: "flex", 
      alignItems: "center", 
      margin: "1.5rem 0",
      color: "rgba(253, 232, 233, 0.5)"
    },
    dividerLine: {
      flex: 1, 
      height: "1px", 
      backgroundColor: "rgba(253, 232, 233, 0.3)"
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
      
      const prompt = 
      `Given the following study guide, generate a ${questionCount}-question multiple choice quiz.
      For each question, provide:
      - A clear question related to the study material
      - 4 plausible answer choices (a, b, c, d)
      - The correct answer
      - A explanation of why the answer is correct
      
      Format each question like this:
      {
        "question": "What is the capital of France?",
        "choices": ["Paris", "Berlin", "Rome", "Madrid"],
        "answer": "Paris",
        "explanation": "Paris has been the capital of France since the 5th century."
      }
      
      Return only a valid JSON array of these question objects.
      
      Study Guide:
      ${studyGuide}`;
      
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

      //Firestore
      const userId = user.uid;
      exportToFirestore(userId, generatedQuestions);

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to generate quiz or couldn't due to no log in. Please try again.");
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

  // Updated next question handler with proper navigation to ResultsPage
  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      // Navigate to ResultsPage with all required data
      navigate("/ResultsPage", { 
        state: { 
          score: score, 
          total: questions.length,
          questions: questions // Passing the full questions array
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

  if (isLoading) return <div style = {styles.body2}>
    <div 
      className = "container vh-100 d-flex flex-column justify-content-center align-items-center" 
      style={styles.loading}>Generating quiz questions...
    </div>
    </div>;

  if (error) return <div style = {styles.body2}>
    <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#FDE8E9" }}>Up-Grade</h3>
        </div>
        <nav>
          <Link to="/quizMe" style={styles.navLink}>Home</Link>
          <Link to="/QuizPage" style={{ ...styles.navLink, ...styles.activeLink }}>Create a Quiz</Link>
        </nav>
    </header>
    <div className = "container vh-100 d-flex flex-column justify-content-center align-items-center" style={styles.loading}>Error: {error}</div>;
  </div>;

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
          <div style={styles.uploadCard}>
            {/* Image Upload Section */}
            <div style={styles.uploadSection}>
              {!imagePath ? (
                <>
                  <FiImage style={styles.uploadIcon} />
                  <h4 style={styles.uploadText}>Upload Study Material Image</h4>
                  <p style={{ ...styles.uploadText, opacity: 0.8, fontSize: "0.9rem" }}>
                    Supports JPG, PNG, or PDF files
                  </p>
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    style={{ display: "none" }}
                    id="imageUpload"
                    accept="image/*"
                  />
                  <label htmlFor="imageUpload" style={styles.uploadButton}>
                    <FiUpload /> Choose File
                  </label>
                </>
              ) : (
                <div style={styles.imagePreviewContainer}>
                  <button 
                    onClick={() => setImagePath("")}
                    style={styles.closeButton}
                  >
                    <FiX />
                  </button>
                  <img 
                    src={imagePath} 
                    style={styles.imagePreview} 
                    alt="Uploaded study material"
                  />
                </div>
              )}
            </div>

            {/* Extract Button - Only shows when image is uploaded */}
            {imagePath && (
              <button 
                onClick={handleExtractText} 
                style={{
                  ...styles.button,
                  width: "100%",
                  maxWidth: "300px",
                  margin: "0 auto 1.5rem",
                  display: "block"
                }}
                disabled={isExtracting}
              >
                {isExtracting ? "Extracting Text..." : "Extract Text from Image"}
              </button>
            )}

            {/* Divider - Only shows when no image is uploaded or after text extraction */}
            {(!imagePath || studyGuide) && (
              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span style={{ margin: "0 1rem" }}>OR</span>
                <div style={styles.dividerLine}></div>
              </div>
            )}

            {/* Text Input Section */}
            <div style={styles.textSection}>
              <div style={styles.sectionHeader}>
                <FiFileText />
                <h4>Enter Study Guide Text</h4>
              </div>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                value={studyGuide}
                onChange={(e) => setStudyGuide(e.target.value)}
                placeholder="Paste your study notes, textbook excerpts, or any relevant material..."
              />
            </div>

            {/* Question Count and Generate Button */}
            <div style={{ marginTop: "2rem" }}>
              <label style={styles.questionsText}>
                Number of Questions to Generate (1-20):
              </label>
              <input
                type="number"
                style={{ 
                  ...styles.input, 
                  width: "80px", 
                  textAlign: "center",
                  marginBottom: "2rem"
                }}
                min="1"
                max="20"
                value={questionCount || ''}
                onChange={handleQuestionCountChange}
              />
              
              <button 
                onClick={generateQuiz} 
                style={{
                  ...styles.secondaryButton,
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
                disabled={!studyGuide.trim() || isExtracting || !questionCount}
              >
                Generate {questionCount} Question{questionCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        ) : (
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
    </div>
  );
}