import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import SampleCard from "../components/SampleCard";
import sampleData from "./sample.data";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.buttons}>
          欢迎访问我的个人网站！我会在这里展示个人技术作品并分享一些技术文章，希望能帮助到你！
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`}>
      <HomepageHeader/>
      <main>
        {sampleData.map((props, idx) => (
          <SampleCard key={idx} {...props} />
        ))}
      </main>
    </Layout>
  );
}
