// ExportToFirestore.js
import { db, collection, addDoc } from '../../firebase';

// Function to export quiz data to Firestore
const exportToFirestore = async (userId, questions) => {
  try {
    const quizCollection = collection(db, "quizzes"); // Reference to 'quizzes' collection
    const docRef = await addDoc(quizCollection, {
      userId: userId, // Store the user's ID to associate the quiz
      questions: questions,
      createdAt: new Date(),
    });
    console.log("Quiz exported to Firestore with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default exportToFirestore;
