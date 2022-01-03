import { Variant } from '@mui/material/styles/createTypography';

type ComponentTagName = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export interface ColumnData {
  /**
   * The text body of the column. May include HTML tags. If block-level tags
   * like `<p>`, `<ol>`, `<ul>`, `<h1-6>`, etc., are used, `bodyComponent`
   * should be set to `"div"`.
   */
  body?: string;
  /**
   * The tag that wraps the text in the `body` property. If the `body` contains
   * block-level tags, this should be set to `"div"`.
   *
   * Other uses include using the `body` for a subheading and setting this to
   * `"h2"` or `"h3"` as appropriate for SEO.
   */
  bodyComponent?: ComponentTagName;
  /**
   * The `text-align` CSS value applied to the text in the `body` property.
   */
  bodyTextAlign?: 'left' | 'center' | 'right';
  /**
   * The Material UI Typography variant to use for the text in the `body`
   * property.
   */
  bodyVariant?: Variant;
  /**
   * The Material UI theme colour of the call to action button.
   */
  callToActionColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  /**
   * The path on this website that the call to action button links to. Paths are
   * normalized to have no trailing slash. Paths should be from the root of the
   * site, so they need to start with a `/`. For example, a call to action for
   * the About page would be `"/about"`.
   *
   * To link to a specific section of a page, the section should have an `id`
   * property set, and that can be appended to the end of this path after a `#`.
   * For example, if there is a section in
   * `/professional-mentorship-program.yml` page with `id: apply`, then a call
   * to action with `/professional-mentorship-program#apply` as the href would
   * automatically scroll to that section when followed.
   */
  callToActionHref?: string;
  /**
   * The text label on the call to action button. This *and* a
   * `callToActionHref` are required for a call to action to be rendered. This
   * prevents accidentally creating buttons that don't link to anything.
   */
  callToActionText?: string;
  /**
   * The Material UI variant for the call to action button.
   */
  callToActionVariant?: 'text' | 'outlined' | 'contained';
  /**
   * The colour of the heading and body text. Since they share a background
   * colour, having only one property for this helps ensure that contrast
   * between the text and background is the same for headings and body text.
   */
  color?: string;
  /**
   * The value of the `action` property of the `<form>` element, when a form is
   * being rendered in the column.
   *
   * We are using Netlify Forms at the time of writing. That means this value
   * should be set to the path of the "thank you" page for submitting the form.
   * It should start with a `/` and have no `/` at the end.
   *
   * A `formName`, `formAction`, and at least one object in `formFields` is
   * required for a form to render.
   */
  formAction?: string;
  /**
   * The text to show in the submit button of the form.
   */
  formButtonText?: string;
  /**
   * The list of fields to render in the form. Both `label` and `type` are
   * required for each field. If the form should not submit without a value in
   * a field, it may have `required` set to `true`.
   */
  formFields?: {
    label: string;
    required?: boolean;
    type: 'text' | 'email' | 'textarea';
  }[];
  /**
   * The text explaining the purpose of the form. Appears as a heading before
   * the form fields.
   */
  formHeading?: string;
  /**
   * Identifies to Netlify which form this is. In the Netlify Forms interface,
   * submissions are grouped by form name, and have different notification
   * settings for each.
   */
  formName?: string;
  /**
   * The larger heading text in the column. May include HTML tags.
   */
  heading?: string;
  /**
   * The tag to use for the heading. For the first and most important heading on
   * the page, this should be set to `"h1"`. In almost all other cases it should
   * be left to its default value.
   */
  headingComponent?: ComponentTagName;
  /**
   * The `text-align` CSS value applied to the text in the `heading` property.
   */
  headingTextAlign?: 'left' | 'center' | 'right';
  /**
   * The Material UI Typography variant to use for the text in the `heading`
   * property.
   */
  headingVariant?: Variant;
  /**
   * The value for the `alt` property of the `<img>` tag. The value of this
   * property *must* be a description of the content of the image. An image will
   * not render unless this property is set.
   */
  imageAlt?: string;
  /**
   * The aspect ratio to crop the image to as a number calculated as the desired
   * width divided by the desired height.
   *
   * For example, for an image to be 3:4, such as 75 pixels wide and 100 pixels
   * tall, set this to `0.75`, which is 3/4.
   *
   * For a square image, set this to `1`.
   */
  imageAspectRatio?: number;
  /**
   * The file name of the image uploaded to Imgix. This should be the file name
   * only with no leading `/`.
   */
  imageFile?: string;
  /**
   * The height of the image file on Imgix. This is the height of the original
   * uploaded image before it gets resized for the site.
   */
  imageOriginalHeight?: number;
  /**
   * The width of the image file on Imgix. This is the width of the original
   * uploaded image before it gets resized for the site.
   */
  imageOriginalWidth?: number;
  /**
   * The number of grid columns that this Column spans. The grid has 12 columns,
   * so any number between 1 and 12 are good. In order for the grid to line up
   * nicely, there should be enough Columns in a Section to span all 12 grid
   * columns.
   */
  span?: number;
  /**
   * The number of units of padding to add to this Column. Sections also have
   * padding, but on mobile when all the columns are one atop another, this
   * value ensures that there is space between their contents.
   *
   * The value is in theme spacing units, so the number should be generally be
   * in the range of 0 to around 10-20 depending on what the design is going
   * for.
   */
  verticalWhiteSpace?: number;
}

export interface SectionData {
  /**
   * The value of the CSS `background` property applied to this section. The
   * background covers the whole width of the page from the left edge to the
   * right edge.
   *
   * This is an important property to get creative in. Multiple backgrounds, CSS
   * gradients, interesting centering, repeating, and sizing, and carefully
   * art-directed images from Imgix can be added.
   */
  background?: string;
  /**
   * The optional fallback CSS `background` property to be applied to mobile
   * devices. Not all backgrounds will work when all the columns are stacked for
   * mobile, so this is a way to design the mobile experience more
   * intentionally.
   */
  backgroundMobile?: string;
  /**
   * The columns that will fill out the section's grid. Each column has a span,
   * from 1 to 12. If there aren't enough columns to fill all 12 grid columns
   * then they're centered on the page. If there are more than 12 grid columns
   * taken up by these columns, the overflowing ones will wrap to a second row.
   */
  columns: ColumnData[];
  /**
   * An `id` to put on the `<section>` element, enabling linking directly to a
   * specific section by adding a fragment identifier (`#id-value`) to the link.
   */
  id?: string;
  /**
   * The minimum height in pixels that the section should be. This is useful for
   * big punchy hero sections where it has a little bit of text, but a big
   * background image.
   *
   * This does not apply to mobile.
   */
  minHeight?: number;
  /**
   * The vertical alignment of the columns in the row. When column in a row are
   * different heights due to content, or when `minHeight` is used, this changes
   * where the contents of those columns are in the grid.
   */
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  /**
   * The number of units of padding to add to this Section. The value is in
   * theme spacing units, so the number should be generally be in the range of 0
   * to around 10-20 depending on what the design is going for.
   */
  verticalWhiteSpace?: number;
}

export interface PageData {
  /**
   * The value of the CSS `background` property applied to the `body` tag. In
   * almost all circumstances, backgrounds will be applied to sections. Use this
   * property as a last resort when an effect isn't possible because it crosses
   * the boundaries between sections.
   */
  background?: string;
  /**
   * The content of the description meta tag in the head of the html page. This
   * may be seen by users if shown to them by search engines.
   */
  description?: string;
  /**
   * The sections that make up the page content. They will be rendered in
   * between the Header and Footer.
   */
  sections: SectionData[];
  /**
   * The text that goes in the document's `<title>` tag. This appears on the
   * browser tab, and as the large blue text in search results.
   */
  title: string;
}

export interface PostData {
  /**
   * The name of the author of the post.
   */
  author: string;
  /**
   * The HTML created from the Markdown in the post `.md` file.
   */
  html: string;
  /**
   * The date that the article was published in the format YYYY-MM-DD.
   */
  publicationDate: string;
  /**
   * The text at the end of the path to this page. This should be in all lower
   * case with words separated by hyphens. As many words from the title of the
   * post should be used because the words in the path are used as a signal in
   * search engines.
   */
  slug: string;
  /**
   * An optional, secondary, longer, or clarifying title for the post. Appears
   * after the title separated by a colon in the page title, and on a separate
   * line on the post page.
   */
  subtitle?: string;
  /**
   * The title of the post.
   */
  title: string;
}
