import { Variant } from '@mui/material/styles/createTypography';

type ComponentTagName = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export interface ColumnData {
  body?: string;
  bodyComponent?: ComponentTagName;
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
  color?: string;
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
  headingComponent?: ComponentTagName;
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
  backgroundMobile?: string;
  columns: ColumnData[];
  id?: string;
  minHeight?: number;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  verticalWhiteSpace?: number;
}

export interface PageData {
  background?: string;
  sections: SectionData[];
  title: string;
}

export interface PostData {
  frontmatter: {
    author: string;
    publicationDate: string;
    slug: string;
    subtitle?: string;
    title: string;
  };
  html: string;
}
