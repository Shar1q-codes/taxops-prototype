import React, { AnchorHTMLAttributes, forwardRef } from 'react';

type NextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

// Minimal shim so we can author against next/link while still using Vite locally.
const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(({ href, children, ...rest }, ref) => (
  <a ref={ref} href={href} {...rest}>
    {children}
  </a>
));

NextLink.displayName = 'NextLinkShim';

export default NextLink;
