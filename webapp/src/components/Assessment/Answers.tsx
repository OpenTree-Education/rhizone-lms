import { Container,Card,CardContent } from '@mui/material';

import React from 'react'

const Answers = () => {
  const answer =  JSON.parse(localStorage.getItem("answer")|| '{}');
  console.log("yes this is the answer ",answer)
  
  return (
    <Container>
    <Card>
      <CardContent>
      <div style={{fontSize:"20px"}}>your score is : {answer} </div>

      </CardContent>
    </Card>
    
    
    </Container>
  )
}
export default Answers;