import React from 'react';

interface MyCoolComponentProps {
  pageId: number;
  message?: string;
}

const MyCoolComponent = ({ pageId }: MyCoolComponentProps) => {
  const messages = [
    'I am a banana!',
    'I am not a banana.',
    'What even *is* a banana anyway?',
  ];
  return <p>{messages[pageId - 1]}</p>;
};

export default MyCoolComponent;
