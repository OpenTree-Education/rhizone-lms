import React from 'react';

interface MyCoolComponentProps {
  pageId: number;
  message?: string;
}

const MyCoolComponent = ({pageId}: MyCoolComponentProps) => {
  const message1 = "I am a banana!";
  const message2 = "I am not a banana";
  return <p>{pageId === 2 ? message1 : message2}</p>;
};

export default MyCoolComponent;
