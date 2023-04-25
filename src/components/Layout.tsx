import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => (
  <main className="flex h-screen justify-center">
    <div className="scrollbar-hide h-full w-full overflow-y-scroll border-x border-slate-400 md:max-w-4xl">
      {props.children}
    </div>
  </main>
);
