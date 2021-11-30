import { ElementType } from 'react';
import { Variant } from '@mui/material/styles/createTypography';

export interface ColumnData {
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
  heading?: string;
  headingComponent?: ElementType;
  headingVariant?: Variant;
  span?: number;
  verticalWhiteSpace?: number;
}

export interface SectionData {
  background?: string;
  color?: string;
  columns: ColumnData[];
  id: string;
}
