import React, { useState } from "react";

import { NavbarComponent } from "../component/head/navbar.component";
import { useI18nContext } from "../../i18n/i18n-react";

interface Props {
  children: JSX.Element;
}

export function PageWrapper(prop: Props) {
  const [currentPage] = useState("/");
  const { LL, locale } = useI18nContext();
  return (
    <div dir={locale == "fa" ? "rtl" : "ltr"}>
      <NavbarComponent />
      <div className="lg:flex-row ">
        <main className=" rounded-3xl ">
          {React.cloneElement(prop.children, { currentPage })}
        </main>
      </div>
    </div>
  );
}
