import { HeaderMenuItem, HeaderMenuItemProps } from "@carbon/react";
import { useMatches, useNavigate } from "@remix-run/react";
import React, { ElementType, ForwardedRef, MouseEventHandler } from "react";

type HeaderMenuItemComponentProps<E extends ElementType = "a"> =
  HeaderMenuItemProps<E> & {
    ref?: ForwardedRef<ElementType>;
  } & {
    to: string;
  };

const RemixedHeaderMenuItem = React.forwardRef<
  ElementType,
  HeaderMenuItemComponentProps
>((props, ref) => {
  const navigate = useNavigate();
  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    // disable browser navigation
    e.preventDefault();
    // remove focus from the link to collapse the menu
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // finally navigate to the desired path
    navigate(props.to);
  };
  const matches = useMatches();
  const page = matches.length > 0 ? matches[matches.length - 1] : null;

  return (
    <HeaderMenuItem
      {...props}
      onClick={onClick}
      ref={ref}
      isActive={page?.pathname === props.to}
      href={props.to}
    >
      {props.children}
    </HeaderMenuItem>
  );
});
RemixedHeaderMenuItem.displayName = "RemixedHeaderMenuItem";

export default RemixedHeaderMenuItem;
