module.exports = {
  title: 'Samer Kanjo',
  description: 'The personal web site of Samer Kanjo',

  themeConfig: {
    repo: 'https://github.com/skanjo/samer.kanjo.net/',
    logo: '/img/logo.png',
    editLinks: true,
    docsDir: 'src',
    lastUpdated: true,
    nav: [
      {text: 'Blog', link: '/blog.html'},
      {text: 'Guides', link: '/guides.html'},
      {text: 'Tutorials', link: '/tutorials.html'},
      {text: 'Reference', link: '/reference/terminal/index.html'},
      {text: 'Projects', link: '/projects.html'},
      {text: 'About', link: '/about.html'},
    ],
    sidebar: {
      '/reference/terminal/': [
        {
          title: 'Terminal',
          collapsable: false,
          children: [
            ['', 'Introduction'],
            'bitcar',
            'brew',
            'curl',
            'gpg',
            'gzip',
            'hadoop',
            'hdfs',
            'jq',
            'ripgrep',
            'sqlite',
            'ssh-keygen',
            'tail',
          ],
        },
      ],
    },
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],
}
