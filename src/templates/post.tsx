import { differenceInYears, format } from "date-fns";
import * as React from "react";
import { Link, PageProps } from "gatsby";

import { Post } from "../models/post";

import { Layout } from "../components/Layout";
import { Seo, SeoProps } from "../components/Seo";
import { Utterances } from "../components/Utterances";

import { path } from "../utils/path";

import "../styles/templates/post.scss";

interface PageContext {
  og: SeoProps;
  post: Post;
}

export default function Page({ pageContext }: PageProps<{}, PageContext>) {
  const { og, post } = pageContext;

  const yearsAfterPublished = differenceInYears(Date.now(), post.publishedAt);

  return (
    <Layout locale={post.locale}>
      <Seo {...og} />
      <article className="template-post" itemScope itemType="http://schema.org/Article">
        <header>
          <h1 className="title" itemProp="headline">
            {post.title}
          </h1>
          <p className="published-at">
            {format(post.publishedAt, post.locale === "ko" ? "yyyy년 M월 d일" : "yyyy-MM-dd")}
          </p>
          <ul className="tag-list">
            {post.tags.map((tag) => (
              <li key={tag.id} className="tag-list-item">
                <Link className="link" to={path(`/tags/${encodeURIComponent(tag.id)}`, post.locale)}>
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
          {yearsAfterPublished >= 1 && (
            <div className="outdated-note">
              {post.locale === "ko" ? (
                <>
                  <p className="title">주의 ⛔️</p>
                  <ul className="descriptions">
                    <li>이 글이 작성된지 {yearsAfterPublished}년이 넘었어요.</li>
                    <li>누구나 숨기고 싶은 흑역사가 있답니다.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="title">Caution ⛔️</p>
                  <ul className="descriptions">
                    <li>I worte this post more than {yearsAfterPublished} years ago.</li>
                    <li>Everyone has a shameful past.</li>
                  </ul>
                </>
              )}
            </div>
          )}
        </header>
        <section className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} itemProp="articleBody" />
        <Utterances />
      </article>
    </Layout>
  );
}
