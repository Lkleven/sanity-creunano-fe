import BlockContent from "@sanity/block-content-to-react";
import Link from "next/link";
import React from "react";
import imageUrlBuilder from "@sanity/image-url";

import Layout from "../components/Layout";
import sanity from "../lib/sanity";
import sanityClient from "../lib/sanity";
import styles from "./styles/work-ad.js";

let builder = imageUrlBuilder(sanityClient);

let mkUrl = source => builder.image(source);

let query = `*[_type == "jobAd" && _id==$id]{
_id,
 title,
 subtitle,
 body,
 "imageUrl": mainImage.asset->url,
 "contact":author -> {name},
 externalLink
 }[0]`;

export default class WorkAd extends React.Component {
  static async getInitialProps(req) {
    return { ad: await sanity.fetch(query, { id: req.query.id }) };
  }

  render() {
    const { ad } = this.props;
    return (
      <Layout>
        <div className="hero-wrapper">
          <div className="hero">
            <div className="hero-content">
              <h1>{ad.title}</h1>
              <p>{ad.subtitle}</p>
            </div>
            <picture className="hero-media">
              <source
                media="(max-width: 400px)"
                srcSet={mkUrl(ad.imageUrl)
                  .width(800)
                  .url()}
              />
              <source
                media="(max-width: 799px)"
                srcSet={mkUrl(ad.imageUrl)
                  .width(800)
                  .url()}
              />
              <source
                media="(min-width: 800px)"
                srcSet={mkUrl(ad.imageUrl).url()}
              />
              <img className="hero-image" src={mkUrl(ad.imageUrl)} />
            </picture>
          </div>
        </div>
        <div className="jobAd">
          <BlockContent blocks={ad.body} />
          <a href={ad.externalLink}>apply here</a>
        </div>
        <style jsx>{styles}</style>
      </Layout>
    );
  }
}
