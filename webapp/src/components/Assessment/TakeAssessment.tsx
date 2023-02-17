import React, { useState ,FormEventHandler, useEffect} from 'react';
import {Card,CardContent,RadioGroup,FormControlLabel,Radio,FormGroup, Checkbox, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';


const data = {
  questions:[
    {id:1,
    question:
    "what is the biggest continent ?",
    answers:[
      "Asia","Africa","Eorupe"
    ],
    type:<Radio />,
    correct:"Asia"
  },
  {id:2,
    question:
    "what is the biggist animal  in the world?",answers:[
      "Blue whale","shark","Elephant"
    ],
    type:<Radio  />,
    correct:"Bule whale"
  },
  {id:3,
    question:
    "what team won in the world cup 2022 ?",answers:[
      "Argentina","France","German"
    ],
    type:<Checkbox  />,
    correct:"Argentina"
  },
  {id:4,
    question:
    "what countries not involved in world war 2",answers:[
      "France","Russia","Swissland"
    ],
    type:<Checkbox  />,
    correct:["France","Russia"]
  },
  {id:5,
    question:
    "In which contery is this historical city ? ",
    answers:[
      "Egypt","Syria","Jordan"
    ],
    image:true,
    type:<Checkbox  />,
    correct:"Jordan"
  },
  {id:6,
    question:
    "What is the World oldest City ? ",
    answers:[
     "damascus","Cairo","Jericho"
    ],
    type:<Radio />,
    correct:"Jericho",
  }

]
}

 const TakeAssessment = () => {
  
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `\answers`; 
    navigate(path);
  }

  const [answer,setAnswer]=useState("");
 
  const [isCheckeded , setIsChecked] = useState(false);
  const [score,setScore]=useState(0)
 
    const onSubmit :FormEventHandler = event=>{
    event.preventDefault();
  
   
    
    const answers = {
      
    };
    
          
            

  }
  

  // const answerList = (answers: string[]) => {
  //   const answerObjects: any[] = [];
    
  //   answers.forEach((answer) => {
  //     answerObjects.push(

  //      <RadioGroup
  //     //  {answer ? answer : ""}
  //       aria-labelledby="demo-radio-buttons-group-label"
  //       name="radio-buttons-group"
  //     > 
  //       {/* <FormControlLabel value={answer} control={data.questions.type} label={answer} />  */}
  //     </RadioGroup>
  //     );
  //   });
  //   return <ul>{answerObjects}</ul>;
  // };
  let arr :any[]= [];
  let count = 0
  console.log("answer",answer)
  const handleSaving =(id:Number)=>{
   

    
    data.questions.filter(item=> item.id === id ).map(val=>{
      
      
     if( val.correct === answer){
      console.log(val.correct === answer)
       count = score +  100;

      
      return setScore(count)

        
        
     }
  
 
    })
  
 
      setAnswer("")         
  }
  useEffect(() => {
    // storing input name
    localStorage.setItem("answer", JSON.stringify(score));
  }, [score]);
  const handleChange = (e:any) => {
   
    const checkedValue = e.target.value;
      setAnswer(checkedValue)

    // setIsChecked(!isCheckeded)
    // if(isCheckeded){
    //   arr.push(checkedValue)
    
      // setAnswer(preState=>[...preState,...arr])
    
  
    
   
    
      
 
    
    

  };
 

  return (
    <form onSubmit={onSubmit} >
       <Card >
       <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center" }} >
      <h1>Take an  Assessment</h1>
      </CardContent>

               {
            data.questions.map((question,idx)=>{
              return <>
         <CardContent  key={idx} sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
          <div style={{display:"flex"
        }}>
             <p style={{padding:"10px"}}>#{question.id}: </p>
             <p style={{padding:"10px"}}
              > {question.question}</p> 
             </div>  
             <div style={{display:"flex",flexDirection:"column"
        }}>
             {question.image && 
             <img alt="history" src='https://upload.wikimedia.org/wikipedia/commons/a/af/Urn_Tomb%2C_Petra_01.jpg' style={{width:"200px"}}/>
             }
             
             </div>  
             <RadioGroup >
              {question.answers.map((answer,idx)=>{
                 return(
                  <FormControlLabel 
                  value={answer}
                 control={question.type} 
                   onChange={handleChange}
                  key={idx} label={answer}></FormControlLabel>
                )
                })
            
              }
               </RadioGroup>   
               <Button 
               onClick={()=>handleSaving(question.id)}
               >Save</Button>
               </CardContent>
                </>
              
            })
            
 }        
  
  
      <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
       
        <Button sx={{ mt: 1, mr: 1 }} type="button" 
        onClick={routeChange}
        variant="outlined">
          Submit
          
        </Button>
        </CardContent>
    </Card>
    </form>
  )
}



export default TakeAssessment;
