import { ElementType } from 'react';
import { Variant } from '@mui/material/styles/createTypography';

export interface ContentData {
  body?: string;
  bodyVariant?: Variant;
  callToActionColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  callToActionHref?: string;
  callToActionText?: string;
  callToActionVariant?: 'text' | 'outlined' | 'contained';
  columns?: number;
  heading?: string;
  headingComponent?: ElementType;
  headingVariant?: Variant;
}

export interface SectionData {
  background?: string;
  color?: string;
  content: ContentData[];
  id: string;
  verticalWhiteSpace?: number;
}
