import { getTranslations } from "next-intl/server";
import OrderClient from "./OrderClient";

export default async function OrderPage() {
  const t1 = await getTranslations("order");
  const t2 = await getTranslations("order2");
  const tPage = await getTranslations("orderPage");

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

  const ui = {
    available_products: tPage("available_products"),
    anesthetics: tPage("anesthetics"),
    allergen_panel: tPage("allergen_panel"),
    order_panel: tPage("order_panel"),
    select_products: tPage("select_products"),
    price_per_item: tPage("price_per_item"),
    quantity: tPage("quantity"),
    subtotal: tPage("subtotal"),
    express_surcharge: tPage("express_surcharge"),
    express_label: tPage("express_label", { fee: "1 500" }),
    total: tPage("total"),
    place_order: tPage("place_order"),
    complete_order: tPage("complete_order"),
    selected_tests: tPage("selected_tests"),
    full_name: tPage("full_name"),
    full_name_placeholder: tPage("full_name_placeholder"),
    phone: tPage("phone"),
    phone_placeholder: tPage("phone_placeholder"),
    branch: tPage("branch"),
    branch_placeholder: tPage("branch_placeholder"),
    express_tag: tPage("express_tag"),
    fill_fields: tPage("fill_fields"),
    submitting: tPage("submitting"),
    confirm_order: tPage("confirm_order"),
    order_submitted: tPage("order_submitted"),
    order_success_sub: tPage("order_success_sub"),
    download_pdf: tPage("download_pdf"),
    done: tPage("done"),
    branches: tPage.raw("branches") as string[],
  };

  return <OrderClient list1={list1} list2={list2} ui={ui} />;
}