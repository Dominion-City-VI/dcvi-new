import { HTMLAttributes } from 'react';

interface ITypographyProps<T> extends HTMLAttributes<T> {
  t?: string;
}

export const Title = ({ className, children, ...rest }: ITypographyProps<HTMLHeadingElement>) => {
  return (
    <h2
      className={`font-grotesk mb-2 scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl ${className}`}
      {...rest}
    >
      {children}
    </h2>
  );
};

export const SubTitle = ({
  className,
  children,
  ...rest
}: ITypographyProps<HTMLHeadingElement>) => {
  return (
    <h3 className={`font-grotesk mb-2 text-lg font-medium md:text-2xl ${className}`} {...rest}>
      {children}
    </h3>
  );
};

export const Paragraph = ({
  className,
  children,
  ...rest
}: ITypographyProps<HTMLParagraphElement>) => {
  return (
    <p className={`font-grotesk text-xs font-thin md:text-sm ${className}`} {...rest}>
      {children}
    </p>
  );
};
