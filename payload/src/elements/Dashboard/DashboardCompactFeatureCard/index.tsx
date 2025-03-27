"use client";
import type { ElementType } from "react";
import React from "react";
import { Button } from "@payloadcms/ui";
import "./index.scss";

export type Props = {
  actions?: React.ReactNode;
  buttonAriaLabel?: string;
  href?: string;
  id?: string;
  Link?: ElementType;
  onClick?: () => void;
  title: string;
  titleAs?: ElementType;
  count?: number;
  variant?: "red" | "yellow";
};

const baseClass = "compact-feature-card";

export const CompactFeatureCard: React.FC<Props> = (props) => {
  const {
    id,
    actions,
    buttonAriaLabel,
    href,
    onClick,
    title,
    titleAs,
    count,
    variant = "red",
  } = props;

  const classes = [
    baseClass,
    id,
    (onClick || href) && `${baseClass}--has-onclick`,
    variant && `${baseClass}--${variant}`, // Add variant class
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = titleAs ?? "div";

  return (
    <div className={classes} id={id}>
      <Tag className={`${baseClass}__title`}>{title}</Tag>
      {actions && <div className={`${baseClass}__actions`}>{actions}</div>}
      {(onClick || href) && (
        <Button
          aria-label={buttonAriaLabel}
          buttonStyle="none"
          className={`${baseClass}__click`}
          el="link"
          onClick={onClick}
          to={href}
        />
      )}
      <span className={`${baseClass}__count`}>{count ?? 0}</span>
    </div>
  );
};
