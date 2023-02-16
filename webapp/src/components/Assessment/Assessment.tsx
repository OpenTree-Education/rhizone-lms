import React,{FormEventHandler,useState } from 'react';
import {Container,RadioGroup,FormControlLabel,Radio,FormGroup, Checkbox, Button ,Grid,Card,CardContent} from '@mui/material';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';


const  StyledDiv= styled.div`
  display :flex;
  flex-direction: column;
  justify-content: center;
  `;
 const Assessment = () => {
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [saveReflectionError, setSaveReflectionError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [journalEntryText, setJournalEntryText] = useState('');
  const [wasJournalEntryTextTouched, setWasJournalEntryTextTouched] =
    useState(false);
    const [selectedOptionIds, setSelectedOptionIds] = useState(
  
    );
    const [url, setUrl] = useState("");
    const [image, setImage] = useState([]);
    const [imageCheck, setImageCheck] = useState(false);
    const uploadImage = () => {}
    
    const onSubmit: FormEventHandler = event => {
    }
  
  
  return (
    <form onSubmit={onSubmit} >
    <Container fixed   >
      <h1>Create Assessment</h1>
       
       <Card>
        <CardContent  sx={{display:"flex",flexDirection:"column",margin:"2px",
         alignItems:"center",border: 1}} >
          
        <div style={{display:"flex"
        }}>
        
        <p style={{padding:"2px"}}>Question #1: </p>
       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </div>
      
       <RadioGroup 
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        <FormControlLabel value="answer1" control={<Radio />} label="answer1" />
        <FormControlLabel value="answer2" control={<Radio />} label="answer2" />
        
      </RadioGroup>

      <div style={{display:"flex",margin:"2px"}}>
      <p style={
      {margin
        :"10px"}
      }>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
   
      </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",
         alignItems:"center",border: 1}}>
      
        <div style={{display:"flex"
        }}>
       <p style={{padding:"2px"}}>Question#2: </p>
       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
       </div>
       <div style={{margin:"10px"}}>
       <FormGroup>
      <FormControlLabel control={<Checkbox  />} label="answer1" />
      <FormControlLabel  control={<Checkbox />} label="answer2" />
    </FormGroup>
      </div>
      <div style={{display:"flex",margin:"2px"}}>
      <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
     
      </CardContent>
      <CardContent  sx={{display:"flex",flexDirection:"column",
         alignItems:"center",border: 1}}>

        <div style={{display:"flex",margin:"10px"
        }}>
       <p style={{padding:"2px"}}>Question #3: </p>
       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
       </div>
     
     
      <div style={{display:"flex",margin:"2px"}}>
      <p >please enter you answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{width:"110px"}}/>
      </div>
      <div style={{display:"flex",margin:"2px"}}>
      <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
    </CardContent>
      <CardContent sx={{display:"flex",flexDirection:"column",
         alignItems:"center",border: 1}}>
     
        <div style={{display:"flex"
        }}>
       <p style={{padding:"10px"}}>Question #4: </p>
       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
       </div>
       <div style={{margin:"10px"}}>
      
      </div>
      <div style={{display:"flex"}}>
      <p style={{padding:"10px"}} 
     
      >upload an image </p>
      <Button variant="contained" component="label">Upload
      <input hidden accept="image/*" multiple type="file" onClick={uploadImage} /> 
      </Button>
      <Button>Add</Button>
      <Button>Delete</Button>
      </div>
      <div style={{display:"flex"}}>
      <p style={{padding:"10px"}}>Answer: </p>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
    
      </CardContent>
    
       
        <CardContent sx={{display:"flex",flexDirection:"column",
         alignItems:"center"}}>
        <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
          Submit
        </Button>
        </CardContent>
        </Card>
    </Container>
    </form>
  )
}

export default Assessment;
