import React from 'react';

interface MyCoolComponentProps {
  pageId: number;
  message?: string;
}

const MyCoolComponent = ({pageId}: MyCoolComponentProps) => {
  const question1 = "What is a boolean?";
  const question2 = "What is Katy's favorite fruit?";

  
  return <p>{pageId % 2 == 0 ? question1 : question2}</p>;
};

export default MyCoolComponent;
