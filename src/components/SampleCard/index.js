import styles from './styles.module.css';
import classNames from "classnames";
import {useBaseUrl} from "@docusaurus/useBaseUrl";
import {useEffect,useState} from "react";
import { marked } from "marked";

export const SampleCard = ({images, docUrl, rtl}) => {
  const [content, setContent] = useState("");
  const containerClass = classNames(styles.container, {[styles.rtl]: rtl});
  const imageClass = classNames(styles.images, {[styles.imagesRtl]: rtl});
  
  useEffect(() => {
    fetch(docUrl)
      .then((res) => res.text())
      .then((text) => setContent(marked(text)));
  }, [docUrl]);
  
  return (
    <div className={containerClass}>
      <div className={imageClass}>
        {images.map((img, idx) => (
          <img src={img} alt="" key={idx}/>
        ))}
      </div>
      <div className={styles.description}>
        <p dangerouslySetInnerHTML={{__html: content}}></p>
      </div>
    </div>
  )
}

export default SampleCard;
