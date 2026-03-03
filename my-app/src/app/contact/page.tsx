import { getTranslations } from "next-intl/server";
import ContactClient from "./contactClient";

export default async function ContactPage() {
  const t = await getTranslations("contact_us");
  const branches = t.raw("branches") as { name: string; address: string }[];

  return (
    <ContactClient
      branches={branches}
      labels={{
        eyebrow: "Allergo Express Med",
        title: t("contact"),
        sub: t("contact_text"),
        phone: t("phone"),
        emailAddress: t("email_address"),
        location: t("location"),
        socials: t("socials"),
        bannerText: t("banner_text"),
        mapText: t("map_text"),
      }}
    />
  );
}