import React, { useState ,FormEventHandler} from 'react';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";
import {TextField,FormGroup,Checkbox,FormControlLabel,RadioGroup,FormLabel,Radio,InputLabel,Select,MenuItem,Card,CardContent, Button,Grid,SelectChangeEvent}  from '@mui/material';
import { Container } from '@mui/system';

 const Form = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = React.useState('');
  
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `\questions`; 
    navigate(path);
  }
  
  return (
<form >
    <Container>
      <Grid container justifyContent="center" direction="column">
   
    <FormControl sx={{ display:"flex","flexDirection":"row" ,margin:"10px"}} >
      <p>Assessment name and Description:</p>
      <TextField
          id="outlined-multiline-flexible"
          label="Assessment Name"
          maxRows={4}
          value= {question}
          onChange={event => setQuestion(event.target.value)}
        />
    </FormControl>
   
    <Grid>
    <FormControl sx={{display:"flex","flexDirection":"row",marginLeft:'26ch',marginRight:"10px"}} >

         <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          value= {description}
          onChange={event => setDescription(event.target.value)}
        />
        
        </FormControl>
        </Grid>
        <CardContent>
        <FormControl sx={{ width:'25ch',display:"flex","flexDirection":"row" ,margin:'10px'}} >
        
        {/* <p style={{margin:"35px"}}>Subject</p> */}
        <InputLabel id="demo-simple-select-label" 
        >Subject</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    sx={{marginLeft:"28ch"}}
    label="Subject"
    value={age}
    onChange={handleChange}
  >
    <MenuItem value="">
            <em>None</em>
          </MenuItem>
    <MenuItem value={10}>Math</MenuItem>
    <MenuItem value={20}>History</MenuItem>
    <MenuItem value={30}>Scince</MenuItem>
  </Select>
        </FormControl>
        </CardContent>
        
        
         
    <CardContent>
    <FormControl sx={{ display:"flex","flexDirection":"row" ,margin:'20px'}}>
      <FormLabel id="demo-radio-buttons-group-label"   sx={{marginRight:"12ch"}}  >Graded/Ungraded</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        row
        name="radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
    </FormControl>
    </CardContent>
    <CardContent>
    <FormControl sx={{ width: '25ch',display:"flex","flexDirection":"row" ,margin:'20px'}}>
      <FormLabel id="demo-radio-buttons-group-label" sx={{marginRight:"10ch"}}  >Assessment/Quizes</FormLabel>
      <FormGroup>
      <FormControlLabel control={<Checkbox  />} label="Assessment" />
      <FormControlLabel  control={<Checkbox />} label="Quiz" />

      
    </FormGroup>
    </FormControl>
    </CardContent>
    <CardContent>
      <Button variant="contained" onClick={routeChange}>Next</Button>
    </CardContent>
    
   
    {/* </Box> */}
    </Grid>
    </Container>
    </form>
  )
  
}
export default Form;


