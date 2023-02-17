import React from 'react'

const Answers = () => {
  const answer =  JSON.parse(localStorage.getItem("answers")|| '{}');
  console.log("answer",answer)
  
  return (
    <div>Answers</div>
  )
}
export default Answers;