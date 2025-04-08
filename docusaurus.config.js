// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Aser1989.cn',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  
  // Set the production url of your site here
  url: 'https://www.aser1989.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'xu.huang', // Usually your GitHub org/user name.
  projectName: 'aser1989.cn', // Usually your repo name.
  
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'baidu-site-verification',
        content:'codeva-DgulddGwaP'
      }
    },
    {
      tagName: 'script',
      attributes: {
        type: 'text/javascript',
      },
      innerHTML: `
        var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?bfdb2bb7d25da8e4d0425e078573025b";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
      `,
    },
  ],
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ASER1989/aser1989.cn',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://www.aser1989.cn/blog',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'keywords', content: 'aser1989,aser1989.cn,docs,blog'},
      ],
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'aser1989.cn',
        logo: {
          alt: 'aser1989.cn',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          // {
          //   position: 'right',
          //   label: 'About',
          //   href: '/about',
          // },
          {
            href: 'https://github.com/ASER1989/aser1989.cn',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright ©${new Date().getFullYear()} aser1989.cn, All rights reserved. Built with Docusaurus.
                    <div style="display: flex;align-items: center;justify-content: center;gap: 10px;font-size: 12px">
                        <div style="display: flex;align-items: center;gap: 3px">
                            <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png"  style="width: 16px"/>
                            <a href="https://beian.mps.gov.cn/#/query/webSearch?code=50011202504994" style="color:#FFFFFF" rel="noreferrer" target="_blank">渝公网安备50011202504994号</a>
                        </div>
                        <a href="https://beian.miit.gov.cn/" target="_blank" style="color:#FFFFFF">渝ICP备2024045736号</a>
                    </div>
                `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
