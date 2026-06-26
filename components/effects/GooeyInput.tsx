"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  useMemo,
  useCallback,
  type ChangeEvent,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="size-4 shrink-0"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const transition = {
  duration: 0.4,
  type: "spring" as const,
  bounce: 0.25,
};

export interface GooeyInputClassNames {
  root?: string;
  buttonRow?: string;
  trigger?: string;
  input?: string;
}

export interface GooeyInputProps {
  placeholder?: string;
  className?: string;
  classNames?: GooeyInputClassNames;
  collapsedWidth?: number;
  expandedWidth?: number;
  expandedOffset?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export function GooeyInput({
  placeholder = "Search…",
  className,
  classNames,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onOpenChange,
  disabled = false,
}: GooeyInputProps) {
  const reactId = useId();
  const inputLayoutId = `search-input-${reactId.replace(/:/g, "")}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const prevExpandedRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const searchText = isControlled ? valueProp : uncontrolledValue;

  const setSearchText = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const setExpanded = useCallback(
    (next: boolean) => {
      setIsExpanded(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else if (prevExpandedRef.current) {
      setSearchText("");
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, setSearchText]);

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: { width: expandedWidth, marginLeft: expandedOffset },
    }),
    [collapsedWidth, expandedWidth, expandedOffset],
  );

  const handleExpand = useCallback(() => {
    if (!disabled) setExpanded(true);
  }, [disabled, setExpanded]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText],
  );

  const handleBlur = useCallback(() => {
    if (!searchText) setExpanded(false);
  }, [searchText, setExpanded]);

  /* Surface (état déployé) — équivalent .cg-card sans border-radius : blanc + hairline + ombre. */
  const surfaceClass = "bg-[var(--cg-bg-card)] shadow-sm ring-1 ring-black/[0.06]";

  return (
    <div
      className={cn("relative flex items-center justify-center", className, classNames?.root)}
    >
      <motion.div
        className={cn("flex h-10 items-center justify-center", classNames?.buttonRow)}
        variants={buttonVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={transition}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={handleExpand}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center rounded-full text-sm font-medium text-[var(--cg-text-1)] outline-none transition-[color,box-shadow]",
            isExpanded ? "justify-start gap-2 px-4" : "justify-center gap-0 px-0",
            isExpanded ? surfaceClass : "bg-transparent hover:bg-black/[0.04]",
            "focus-visible:ring-2 focus-visible:ring-[var(--cg-cta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cg-bg)]",
            "disabled:pointer-events-none disabled:opacity-50",
            classNames?.trigger,
          )}
        >
          <SearchIcon />
          <motion.input
            layoutId={inputLayoutId}
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={searchText}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || !isExpanded}
            placeholder={placeholder}
            className={cn(
              "h-full bg-transparent text-sm text-[var(--cg-text-1)] outline-none",
              "placeholder:text-[var(--cg-text-2)]",
              isExpanded
                ? "min-w-0 flex-1 opacity-100"
                : "w-0 overflow-hidden opacity-0 pointer-events-none",
              classNames?.input,
            )}
          />
        </button>
      </motion.div>
    </div>
  );
}
