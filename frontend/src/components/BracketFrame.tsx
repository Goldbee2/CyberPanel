import React, { type ReactNode } from "react";

type BracketFrameProps = {
    children: ReactNode;
    /** Classes on the outer wrapper (layout, padding, etc.) */
    className?: string;
    /** Classes on the element that wraps `children` */
    contentClassName?: string;
    /** Override corner brackets (size, color). Defaults to small L-brackets using ink-tertiary. */
    bracketClassName?: string;
};

const cornerBase =
    "pointer-events-none absolute box-border h-3 w-3 border-ink-tertiary opacity-40";

export default function BracketFrame({
    children,
    className = "",
    contentClassName = "",
    bracketClassName = cornerBase,
}: BracketFrameProps) {
    return (
        <div className={`relative ${className}`.trim()}>
            <span
                className={`${bracketClassName} left-0 top-0 border-l border-t`}
                aria-hidden
            />
            <span
                className={`${bracketClassName} right-0 top-0 border-r border-t`}
                aria-hidden
            />
            <span
                className={`${bracketClassName} bottom-0 left-0 border-b border-l`}
                aria-hidden
            />
            <span
                className={`${bracketClassName} bottom-0 right-0 border-b border-r`}
                aria-hidden
            />
            <div className={contentClassName}>{children}</div>
        </div>
    );
}
