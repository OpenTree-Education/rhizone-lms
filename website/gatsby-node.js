const path = require('path');

const transformPostToPageContext = ({
  frontmatter: { author, publicationDate, subtitle, title },
  html,
}) => {
  const formattedTitle = `${title}${subtitle ? ': ' : ''}${subtitle}`;
  return {
    title: `${formattedTitle} | OpenTree Education Blog`,
    sections: [
      {
        verticalWhiteSpace: 6,
        columns: [
          { span: 2 },
          {
            heading: title,
            headingComponent: 'h1',
            headingVariant: 'h2',
            body: subtitle,
            bodyVariant: 'h4',
            span: 8,
          },
          { span: 2 },
        ],
      },
      {
        verticalWhiteSpace: 0,
        columns: [
          { span: 2 },
          {
            body: `Published on ${publicationDate} by ${author}.`,
            bodyVariant: 'body2',
            span: 8,
          },
          { span: 2 },
        ],
      },
      {
        verticalWhiteSpace: 6,
        columns: [
          { span: 2 },
          {
            body: html,
            span: 8,
          },
          { span: 2 },
        ],
      },
    ],
  };
};

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const listPagesResult = await graphql(`
    query ListPages {
      allPagesYaml {
        nodes {
          background
          title
          sections {
            background
            color
            columns {
              body
              bodyComponent
              bodyTextAlign
              bodyVariant
              callToActionColor
              callToActionHref
              callToActionText
              callToActionVariant
              formAction
              formButtonText
              formFields {
                label
                required
                type
              }
              formHeading
              formName
              heading
              headingComponent
              headingTextAlign
              headingVariant
              span
              verticalWhiteSpace
            }
            id
            verticalAlignment
            verticalWhiteSpace
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);

  const listBlogPostsResult = await graphql(`
    query ListBlogPosts {
      allMarkdownRemark {
        nodes {
          excerpt(format: PLAIN)
          frontmatter {
            author
            publicationDate
            slug
            subtitle
            title
          }
          html
        }
      }
    }
  `);

  const posts = listBlogPostsResult.data.allMarkdownRemark.nodes.map(
    transformPostToPageContext
  );

  const data = { posts };

  const pageTemplatePath = path.resolve(`./src/templates/Page.tsx`);

  for (const {
    parent: { name: path },
    ...context
  } of listPagesResult.data.allPagesYaml.nodes) {
    createPage({
      path: path === 'index' ? '/' : path,
      component: pageTemplatePath,
      context,
    });
  }

  for (const context of listBlogPostsResult.data.allMarkdownRemark.nodes) {
    const {
      frontmatter: { publicationDate, slug },
    } = context;
    createPage({
      path: `/blog/${publicationDate.substr(0, 10)}-${slug}/`,
      component: pageTemplatePath,
      context: transformPostToPageContext(context, data),
    });
  }
};
