import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import TravelArticle, { travelArticleToc } from "@/components/travel/TravelArticle";
import japan24 from "@/data/travel-articles/japan-24.json";
import type { TravelArticle as TravelArticleData } from "@/types/travelArticle";

const article = japan24 as TravelArticleData;

export const metadata: Metadata = {
  title: `${article.place} ’${article.startDate.slice(-2)} · Lucy Gai`,
};

export default function Japan24Page() {
  return (
    <SiteShell toc={travelArticleToc(article)}>
      <TravelArticle article={article} />
    </SiteShell>
  );
}
