module.exports = {
  siteMetadata: {
    siteUrl: "http://output-racing-gatsby.s3-website-us-west-2.amazonaws.com",
    title: "Output Racing League",
  },
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: "hnJokTLzykmhsacKuzCdXre6Uf0LHDTMQ418DC2oZEc",
        spaceId: "38idy44jf6uy",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "output-racing-gatsby",
        region: 'us-west-2',
        acl: null
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
  ],
};
