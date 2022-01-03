module.exports = {
  siteMetadata: {
    siteUrl: 'https://opentree.education',
    title: 'OpenTree Education',
  },
  plugins: [
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'G-E6PN8WQS9N',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: `@imgix/gatsby`,
      options: {
        domain: 'opentree-education.imgix.net',
        defaultImgixParams: { auto: ['compress', 'format'] },
      },
    },
    'gatsby-transformer-yaml',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: './src/content/',
      },
      __key: 'content',
    },
    {
      resolve: 'gatsby-plugin-force-trailing-slashes',
      options: {
        excludedPaths: [`/404.html`],
      },
    },
  ],
};
