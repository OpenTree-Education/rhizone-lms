import React, { useState } from 'react';

// type BookProps = {
//     data:string;
//     };

enum StatusTab {
    All,
    Milk,
    Fruit,
    Vegetable,
  }

interface TabProps {
    currentStatusTab: StatusTab; 
    setCurrentStatusTab: string;
  }

 const AssessPageTab:React.FunctionComponent<TabProps> = (props) => {
// const AssessPageTab:React.FunctionComponent<BookProps> = (props) => {

 const {StatusTab,currentStatusTab,setCurrentStatusTab}  =props;


    // const {data} =props;
    // return <p>{data}</p>
    
};

export default AssessPageTab;

