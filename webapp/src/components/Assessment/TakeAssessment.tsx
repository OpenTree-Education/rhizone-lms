import React, { useState ,FormEventHandler} from 'react';
import {Card,CardContent,RadioGroup,FormControlLabel,Radio,FormGroup, Checkbox, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';



 const TakeAssessment = () => {
  const [question,setQuestion] = useState();
  const onSubmit :FormEventHandler = event=>{
    event.preventDefault();
  }
  
  return (
    <form onSubmit={onSubmit} >
       <Card >
       <CardContent  >
      <h1>Create Assessment</h1>
      </CardContent>
       
       <CardContent  sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}} >
        
        <div style={{display:"flex"
        }}>
       <p style={{padding:"10px"}}>Question #1: </p>
       <p style={{padding:"10px"}}>what is the biggest continent ?</p>
       </div>
      
       <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      > 
        <FormControlLabel value="answer1" control={<Radio />} label="answer1" />
        <FormControlLabel value="answer2" control={<Radio />} label="answer2" />
   
        
      </RadioGroup>
      <Button>Save</Button>

      </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
      <div style={{display:"flex"}}>
      {/* <p style={{padding:"10px"}}>Answer: </p> */}
      {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
      </div>
      
      <div style={{display:"flex",flexDirection:"column" ,alignItems:"center"
        }}>
      <div style={{display:"flex"}}>
       <p style={{padding:"10px"}}>Question #2: </p>
       <p style={{padding:"10px"}}>what conteries involved in world war 2 ?</p>
       </div>
  
       
       <FormGroup>
      <FormControlLabel control={<Checkbox  />} label="answer1" />
      <FormControlLabel  control={<Checkbox />} label="answer2" />
      <FormControlLabel  control={<Checkbox />} label="answer3" />
      
    </FormGroup>
    <Button>Save</Button>
   
      {/* <div style={{display:"flex"}}> */}
      {/* <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
      {/* </div> */}
      </div>
      </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
      
        <div style={{display:"flex"
        }}>
        <p style={{padding:"10px"}}>Question #3: </p>
       <p style={{padding:"10px"}}>What is the World oldest City ? </p>
       {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
       </div>
       <div style={{margin:"10px"}}>
      
      </div>
      <div style={{display:"flex"}}>
      <p style={{padding:"10px"}}>please enter you answer: </p>
      <TextField id="outlined-basic" label="Your Answer" variant="outlined" />
     
      </div>
      <div> <Button>Save</Button></div>
    
      <div style={{display:"flex"}}>
      {/* <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
      </div>
      </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
     
        <div style={{display:"flex"
        }}>
          
       <p style={{padding:"10px"}}>Question #4: </p>
       <div style={{display:"flex",flexDirection:"column"}}>
       <p style={{padding:"10px"}}>In which contery is this historical city  ? </p>
       
       <img alt="history" src='https://upload.wikimedia.org/wikipedia/commons/a/af/Urn_Tomb%2C_Petra_01.jpg' style={{width:"200px"}}></img>
       <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
            
        <FormControlLabel value="answer1" control={<Radio />} label="Egypt" />
        <FormControlLabel value="answer2" control={<Radio />} label="Jordan" />
        <FormControlLabel value="answer3" control={<Radio />} label="Syria" />

        
      </RadioGroup>
      </div>
       </div>
       <div style={{margin:"10px"}}>
       <Button>Save</Button>
      </div>
       
    
      <div style={{display:"flex"}}>
      {/* <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
      </div>
   
      </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}}>
       
        <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
          Submit
        </Button>
        </CardContent>
    </Card>
    </form>
  )
}



export default TakeAssessment;
