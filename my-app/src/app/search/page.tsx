import { getTranslations, getLocale } from "next-intl/server";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const t = await getTranslations("search");
  const locale = await getLocale();

  const ui = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    sub: t("sub"),
    codeLabel: t("codeLabel"),
    placeholder: t("placeholder"),
    hint: t("hint"),
    searching: t("searching"),
    search: t("search"),
    errorInvalid: t("errorInvalid"),
    errorNotFound: t("errorNotFound"),
    resultLabel: t("resultLabel"),
    metaDate: t("metaDate"),
    metaName: t("metaName"),
    metaBranch: t("metaBranch"),
    viewPdf: t("viewPdf"),
    pending: t("pending"),
    autoNotFound: t("autoNotFound"),
  };

  return <SearchClient ui={ui} locale={locale} />;
}