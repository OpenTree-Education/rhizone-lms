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
    type:<Radio />
  },
  {id:2,
    question:
    "what is the biggist anmail in the world?",answers:[
      "whale","shark"
    ],
    type:<Checkbox  />
  },
  {id:3,
    question:
    "what team win in the world cup ?",answers:[
      "argintina","Brizel","German"
    ],
    type:<Checkbox  />
  },
  {id:4,
    question:
    "what conteries involved in world war 2 ?",answers:[
      "argintina","Brizel","German"
    ],
    type:<Checkbox  />
  },
  {id:5,
    question:
    "In which contery is this historical city ? ",
    answers:[
      "Egypt","Syria","Jordan"
    ],
    image:true,
    type:<Checkbox  />
  },
  {id:6,
    question:
    "What is the World oldest City ? ",
    answers:[
     "damascus","Cairo","Baghdad"
    ],
    type:<Radio />
  }

]
}

 const TakeAssessment = () => {
  
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `\answers`; 
    navigate(path);
  }
  const [question,setQuestion] = useState();
  const [answer,setAnswer]=useState<File[]>([])
  const [list,setList]=useState<File[]>([])
  // const [selectOption,setSelectOption]=useState()
  const [isCheckeded , setIsChecked] = useState(false);
 
    const onSubmit :FormEventHandler = event=>{
    event.preventDefault();
  
    console.log("list of answers" ,answer)
    localStorage.setItem("answer", JSON.stringify(answer));
    
    const answers = {
      
    };
    
            // fetch('/answer', {
            //     method: 'POST',
            //     headers: {"Content-Type" : "application/json" },
            //     body: JSON.stringify({
                 
            //       answer:answer
            //       })
            // }).then(() => {
            //     alert('done');
            // })
            

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
  const handleChange = (e:any) => {
   
    const checkedValue = e.target.value;


    setIsChecked(!isCheckeded)
    if(isCheckeded){
      arr.push(checkedValue)
    
      setAnswer(preState=>[...preState,...arr])
    }
  
    
   
    
      
    
      localStorage.setItem("answer", JSON.stringify(answer));
 
    
    
    console.log("cc",isCheckeded,answer)
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
               <Button onClick={()=>{
             
               }}>Save</Button>
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
