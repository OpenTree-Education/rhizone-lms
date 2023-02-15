
import { Typography, Box } from "@mui/material";
import React from "react";
import AssesmentCard from "./AssessmentCard";



const AssessmentPage = () => {






return (
    <> 
    <Box ml={10} mr={10}> <Typography variant="h4" mt={5} mb={5}>Hi User,</Typography>
<Typography mb={5}>Welcome to the assessment page! We are glad to have you here. This page is designed to help you keep track of your past and upcoming assessments, including the grades you received and any feedback from assessors. We understand that assessments can be an important part of your learning journey, and we want to make sure you have easy access to all the information you need to stay on top of your progress. Please feel free to explore the page and let us know if you have any questions or feedback. We are here to help you succeed!
</Typography>
<AssesmentCard/>
</Box>   
</>

);
}

export default AssessmentPage