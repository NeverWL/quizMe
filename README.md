# Up-Grade

Up-Grade turns your study materials into smart quizzes using Google Tesseract and Gemini—just snap, study, and score. Get instant feedback, track your performance, save your work, and more!

## Inspiration

Studying can be overwhelming—especially when jumping between textbooks, notes, and online tools. We wanted a faster, smarter way to turn passive reading into active recall. Up-Grade was born out of a simple idea: what if you could take a screenshot of your study material and instantly turn it into a personalized quiz?

## What it does

Up-Grade lets users snap a screenshot of study material like textbook pages or handwritten notes. Then, using Google Tesseract, it extracts the text. Alternatively, the user can input a PDF of the material for Gemini to generate custom quizzes with explanations and instant feedback. Users, are then given a set of curated flashcard after the quiz to cultivate active recall. Finally, if users choose to sign in, quiz history is given to review past quizzes.

## How we built it

We used:
- Google Tesseract OCR to extract text from images
- Gemini (via Google AI APIs) to generate high-quality quiz questions and explanations
- A frontend interface built with React, HTML, CSS, and Bootstrap
- A backend for quiz history of users built with Firebase
