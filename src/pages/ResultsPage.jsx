import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ResultsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const percentage = Math.round((state.score / state.total) * 100);
    const questions = state.questions || [];

    const styles = {
        body: {
            background: "linear-gradient(to bottom, #503D3F, #2A1F21)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "0 1rem",
            color: "#FDE8E9"
        },
        header: {
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
        button: {
            backgroundColor: "#ADDC92",
            textDecoration: "none",
            color: "#503D3F",
            borderRadius: "20px",
            border: "none",
            fontWeight: "bold",
            padding: "0.75rem 1.5rem",
            margin: "0.5rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
                backgroundColor: "#9DCC82",
            },
        },
        resultsContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            padding: "2rem",
            textAlign: "center"
        },
        scoreText: {
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "#FDE8E9"
        },
        percentageCircle: {
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: `conic-gradient(#ADDC92 ${percentage}%, #503D3F ${percentage}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        },
        percentageText: {
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#FDE8E9",
            background: "#503D3F",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        flashcardContainer: {
            width: "100%",
            maxWidth: "600px",
            margin: "2rem auto",
            perspective: "1000px"
        },
        flashcard: {
            backgroundColor: "#FDE8E9",
            color: "#503D3F",
            borderRadius: "15px",
            padding: "2rem",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: showAnswer ? "rotateY(180deg)" : "rotateY(0)"
        },
        flashcardFace: {
            position: "absolute",
            width: "calc(100% - 4rem)",
            height: "calc(100% - 4rem)",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        },
        flashcardFront: {
            transform: "rotateY(0deg)"
        },
        flashcardBack: {
            transform: "rotateY(180deg)"
        },
        flashcardQuestion: {
            fontSize: "1.5rem",
            marginBottom: "1rem",
            fontWeight: "bold"
        },
        flashcardAnswer: {
            fontSize: "1.2rem",
            color: "#2A1F21",
            fontStyle: "italic"
        },
        flashcardControls: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem"
        },
        flashcardNavButton: {
            backgroundColor: "#503D3F",
            color: "#FDE8E9",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed"
            }
        },
        flashcardToggleButton: {
            backgroundColor: "#ADDC92",
            color: "#503D3F",
            border: "none",
            borderRadius: "20px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold"
        },
        flashcardCounter: {
            color: "#503D3F",
            fontWeight: "bold"
        },
        buttonGroup: {
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            justifyContent: "center"
        }
    };

    const handleNextCard = () => {
        setCurrentCard((prev) => (prev + 1) % questions.length);
        setShowAnswer(false);
    };

<<<<<<< HEAD
    const handlePrevCard = () => {
        setCurrentCard((prev) => (prev - 1 + questions.length) % questions.length);
        setShowAnswer(false);
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const renderFlashcardControls = () => (
        <div style={styles.flashcardControls}>
            <button 
                onClick={handlePrevCard}
                style={styles.flashcardNavButton}
                disabled={currentCard === 0}
            >
                <FiChevronLeft size={20} />
            </button>
            
            <span style={styles.flashcardCounter}>
                {currentCard + 1} / {questions.length}
            </span>
            
            <button 
                onClick={handleNextCard}
                style={styles.flashcardNavButton}
                disabled={currentCard === questions.length - 1}
            >
                <FiChevronRight size={20} />
            </button>
=======
        <div className = "container vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="mb-3" style = {styles.header}>Your Score: {state.score} / {state.total}</h1>
          <button onClick={() => navigate("/quizMe")} style={styles.button}>Back to Home</button>
>>>>>>> 54ff3946e5ab61937d83dcaa5564cdf00bf32f86
        </div>
    );

    return (
        <div style={styles.body}>
            <header style={styles.header}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{ margin: 0, color: "#FDE8E9" }}>Up-Grade</h3>
                </div>
                <nav>
                    <Link to="/quizMe" style={styles.navLink}>Home</Link>
                    <Link to="/QuizPage" style={{ ...styles.navLink, ...styles.activeLink }}>Create a Quiz</Link>
                </nav>
            </header>

            <div style={styles.resultsContainer}>
                <h1 style={styles.scoreText}>Your Score: {state.score} / {state.total}</h1>
                
                <div style={styles.percentageCircle}>
                    <div style={styles.percentageText}>{percentage}%</div>
                </div>

                {questions.length > 0 && (
                    <div style={styles.flashcardContainer}>
                        <div style={styles.flashcard}>
                            {/* Front of the card (Question) */}
                            <div style={{ ...styles.flashcardFace, ...styles.flashcardFront }}>
                                <div style={styles.flashcardQuestion}>
                                    Question {currentCard + 1}: {questions[currentCard].question}
                                </div>
                                <div>
                                    <button 
                                        onClick={toggleAnswer}
                                        style={styles.flashcardToggleButton}
                                    >
                                        Show Answer
                                    </button>
                                    {renderFlashcardControls()}
                                </div>
                            </div>
                            
                            {/* Back of the card (Answer) */}
                            <div style={{ ...styles.flashcardFace, ...styles.flashcardBack }}>
                                <div>
                                    <div style={styles.flashcardQuestion}>
                                        Correct Answer: {questions[currentCard].answer}
                                    </div>
                                    <div style={styles.flashcardAnswer}>
                                        {questions[currentCard].explanation || "No explanation provided."}
                                    </div>
                                </div>
                                
                                <div>
                                    <button 
                                        onClick={toggleAnswer}
                                        style={styles.flashcardToggleButton}
                                    >
                                        Show Question
                                    </button>
                                    {renderFlashcardControls()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={styles.buttonGroup}>
                    <button 
                        onClick={() => navigate("/QuizPage")} 
                        style={styles.button}
                    >
                        Create New Quiz
                    </button>
                    <button 
                        onClick={() => navigate("/quizMe")} 
                        style={{ ...styles.button, backgroundColor: "#503D3F", color: "#FDE8E9" }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}