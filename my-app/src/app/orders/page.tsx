import { getTranslations } from "next-intl/server";
import OrderClient from "./OrderClient";

export default async function OrderPage() {
  const t1 = await getTranslations("order");
  const t2 = await getTranslations("order2");

  const list1 = Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    name: t1(`test${i + 1}`),
    description: t1(`desc${i + 1}`),
  }));

  const list2 = Array.from({ length: 55 }, (_, i) => ({
    id: i + 1,
    name: t2(`test${i + 1}`),
    description: "",
  }));

  return <OrderClient list1={list1} list2={list2} />;
}