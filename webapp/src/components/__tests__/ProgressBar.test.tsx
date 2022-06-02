import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';
import React from 'react';

describe('testing if progress bar inside Profile component is rendering', () => {
  it('should render progress bar', () => {
    render(<ProgressBar />);
    expect(screen.getByText('Learning Progress')).toBeInTheDocument();
  });
});
