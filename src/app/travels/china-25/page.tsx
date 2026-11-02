import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import TravelArticle, { travelArticleToc } from "@/components/travel/TravelArticle";
import china25 from "@/data/travel-articles/china-25.json";
import type { TravelArticle as TravelArticleData } from "@/types/travelArticle";

const article = china25 as TravelArticleData;

export const metadata: Metadata = {
  title: `${article.place} ’${article.startDate.slice(-2)} · Lucy Gai`,
};

export default function China25Page() {
  return (
    <SiteShell toc={travelArticleToc(article)}>
      <TravelArticle article={article} />
    </SiteShell>
  );
}
