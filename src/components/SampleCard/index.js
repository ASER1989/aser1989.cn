import styles from './styles.module.css';
import classNames from "classnames";
import {useBaseUrl} from "@docusaurus/useBaseUrl";
import {useEffect,useState,useRef} from "react";
import { marked } from "marked";

export const SampleCard = ({images, docUrl, rtl}) => {
  const [content, setContent] = useState("");
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const containerClass = classNames(styles.container, {[styles.rtl]: rtl});
  const imageClass = classNames(styles.images, {[styles.imagesRtl]: rtl});
  
  useEffect(() => {
    fetch(docUrl)
      .then((res) => res.text())
      .then((text) => setContent(marked(text)));
  }, [docUrl]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(entry);
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target); // 只触发一次
        }
      },
      {
        threshold: 0.1, // 元素进入 10% 就触发
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  return (
    <div className={containerClass}>
      <div className={`${imageClass} ${inView ? styles.imagesInView: ''}`}  ref={ref}>
        {images.map((img, idx) => (
          <img src={img} alt="" key={idx}/>
        ))}
      </div>
      <div className={`${styles.description} ${inView ? styles.descriptionInView: ''}`}>
        <p dangerouslySetInnerHTML={{__html: content}}></p>
      </div>
    </div>
  )
}

export default SampleCard;
