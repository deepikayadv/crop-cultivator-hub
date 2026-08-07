import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-canopy">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-75">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {body ? <p className="mt-3 max-w-2xl text-sm opacity-85 sm:text-base">{body}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">{children}</div>;
}
