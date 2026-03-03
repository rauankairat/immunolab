import { getTranslations } from "next-intl/server";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const t = await getTranslations("team");
  return (
    <TeamClient
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        sub: t("sub"),
        medicalTeam: t("medical_team"),
        devTeam: t("dev_team"),
        tableName: t("table_name"),
        tableRole: t("table_role"),
      }}
    />
  );
}