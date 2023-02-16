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
    // const uploadImage = () => {
    //   const data = new FormData();
    //   data.append("file", image);
    //   data.append("upload_preset", "");
    //   data.append("cloud_name", "");
      
    //     .post("https://api.cloudinary.com/v1_1/dj8arn33b/image/upload", data)
    //     .then((response) => {
    //       setImageCheck(true);
          
  
    //       setUrl(response.data.url);
    //     });
    // };
    const onSubmit: FormEventHandler = event => {
    }
  // const onSubmit: FormEventHandler = event => {
  //   event.preventDefault();
  //   setIsSavingReflection(true);
  //   fetch(`${process.env.REACT_APP_API_ORIGIN}/reflections`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       raw_text: journalEntryText,
  //       // selected_option_ids: Array.from(selectedOptionIds.values()),
  //     }),
  //   })
  //     .then(res => res.json())
  //     .then(({ data, error }) => {
  //       setIsSavingReflection(false);
  //       if (error) {
  //         setSaveReflectionError(error);
  //       }
  //       if (data) {
  //         setIsSuccessMessageVisible(true);
  //         setJournalEntryText('');
         
  //       }
  //     })
  //     .catch(error => {
  //       setIsSavingReflection(false);
  //       setSaveReflectionError(error);
  //     });
  // };
  
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
      // onChange={(e) => setImage(e.target.files[0])}
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
