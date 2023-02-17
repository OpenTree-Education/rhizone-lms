import FormLabel from '@mui/material/FormLabel';
import React from 'react';

interface MyCoolComponentProps {
  questionNumber: number;
  message?: string;
}

const Questions: { text: string, answer_correct: string, answer2: string, answer3: string }[] = [ 
{
  text: "What is Katy's favorite fruit?",
  answer_correct: "mango", 
  answer2: "apple", 
  answer3: "nectarine"
}, 

{
  text: "What is a boolean?", 
  answer_correct: "a true or false data type", 
  answer2: "a mean person", 
  answer3: "a ghost lean"
},

{
  text: "What does html stand for?", 
  answer_correct: "hyper-text markup language", 
  answer2: "Harold trottles in massive leggings", 
  answer3: "hold this my lad"
}, 

{
  text: "What is a float?", 
  answer_correct: "A soft drink with a scoop of icecream floating in it", 
  answer2: "A number with one or more decimal points", 
  answer3: "A type of pool noodle"
}
]



const MyCoolComponent = ({questionNumber: questionNumber}: MyCoolComponentProps) => {
  const question1 = "What is a boolean?";
  const question2 = "What is Katy's favorite fruit?";

  return <FormLabel id="demo-error-radios">{Questions[questionNumber].text}</FormLabel>;

  // array = [question 1, question 2, question 3]
  

  // array(quiz-question-number)
};

export default MyCoolComponent;
