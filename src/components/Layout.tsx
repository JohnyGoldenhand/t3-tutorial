import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => (
  <main className="flex h-screen justify-center">
    <div className="h-full w-full overflow-y-scroll border-x border-slate-400 scrollbar-hide md:max-w-4xl">
      {props.children}
    </div>
  </main>
);
