import { ElementType } from 'react';
import { Variant } from '@mui/material/styles/createTypography';

export interface ColumnData {
  body?: string;
  bodyComponent?: ElementType;
  bodyTextAlign?: 'left' | 'center' | 'right';
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
  formAction?: string;
  formButtonText?: string;
  formFields?: {
    label: string;
    required?: boolean;
    type: 'text' | 'email' | 'textarea';
  }[];
  formHeading?: string;
  formName?: string;
  heading?: string;
  headingComponent?: ElementType;
  headingTextAlign?: 'left' | 'center' | 'right';
  headingVariant?: Variant;
  imageAlt?: string;
  imageAspectRatio?: number;
  imageFile?: string;
  imageOriginalHeight?: number;
  imageOriginalWidth?: number;
  span?: number;
  verticalWhiteSpace?: number;
}

export interface SectionData {
  background?: string;
  color?: string;
  columns: ColumnData[];
  id: string;
  minHeight?: number;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  verticalWhiteSpace?: number;
}

export interface PageData {
  background?: string;
  sections: SectionData[];
  title: string;
}
