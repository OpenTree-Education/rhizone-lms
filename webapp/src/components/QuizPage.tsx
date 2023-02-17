import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';

import { containerClasses } from '@mui/system';


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

export default function ErrorRadios() {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const nextQuestion = () => {
      if (currentQuestion >= 0 && currentQuestion <= Questions.length-2){
        setCurrentQuestion(currentQuestion +1);};
    };
    const previousQuestion = () => {
      if (currentQuestion > 0 && currentQuestion <= Questions.length-1){
        setCurrentQuestion(currentQuestion -1);};
  };
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);

  const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value === 'correct') {
      setHelperText('You got it!');
      setError(false);
    } else if (value != 'correct') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <Grid container justifyContent="center">
        <Box component="span" sx={{ p: 2, border: '1px solid grey' }}>
        <form onSubmit={handleSubmit}>
        <FormControl sx={{ m: 3 }} error={error} variant="standard">
            <FormLabel id="demo-error-radios">{Questions[currentQuestion].text}</FormLabel>

            <RadioGroup
            aria-labelledby="demo-error-radios"
            name="quiz"
            value={value}
            onChange={handleRadioChange}
            >
            <FormControlLabel value="correct" control={<Radio />} label={Questions[currentQuestion].answer_correct} />
            <FormControlLabel value="incorrect1" control={<Radio />} label={Questions[currentQuestion].answer2} />
            <FormControlLabel value="incorrect2" control={<Radio />} label={Questions[currentQuestion].answer3} />
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Check Answer
            </Button>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" color="secondary" onClick={previousQuestion}>
            Previous Question
            </Button>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" color="secondary" onClick={nextQuestion}>
            Next Question
            </Button>
        </FormControl>
        </form>
        </Box>
    </Grid>
  );
}
