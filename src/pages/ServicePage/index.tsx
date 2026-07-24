import PageRenderer from "../../components/PageRenderer";

import type { ServicePageProps } from "./type"


export default function ServicePage({
  service,
}: ServicePageProps) {

  return (

    <PageRenderer
    sections={service.sections}
    />

  );

}
