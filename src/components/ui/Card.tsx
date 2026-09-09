import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={clsx('rounded-lg border border-gray-200 bg-white shadow-sm', className)} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={clsx('border-b border-gray-200 px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ className, children, ...props }) => (
  <h2 className={clsx('text-xl font-semibold text-gray-900', className)} {...props}>
    {children}
  </h2>
);

export const CardDescription: React.FC<CardProps> = ({ className, children, ...props }) => (
  <p className={clsx('text-sm text-gray-600', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={clsx('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={clsx('border-t border-gray-200 px-6 py-4', className)} {...props}>
    {children}
  </div>
);
