import { render, RenderResult } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

let documentBody: RenderResult;

describe('testing if progress bar inside Profile component is rendering', () => {
  beforeEach(() => {
    documentBody = render(<ProgressBar />);
  });
  it('should render progress bar', () => {
    expect(documentBody.getByText('Learning Progress')).toBeInTheDocument();
  });
});
