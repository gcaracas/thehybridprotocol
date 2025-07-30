import React from 'react';
import { 
  Typography as MTTypography,
  Button as MTButton,
  Input as MTInput,
  Card as MTCard,
  CardBody as MTCardBody,
  IconButton as MTIconButton,
  Navbar as MTNavbar,
  Collapse as MTCollapse
} from '@material-tailwind/react';

// Type-safe wrappers for Material Tailwind components
interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'lead' | 'paragraph' | 'small';
  color?: string;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  [key: string]: unknown;
}

interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'gradient' | 'text';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  [key: string]: unknown;
}

interface InputProps {
  type?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelProps?: Record<string, unknown>;
  icon?: React.ReactNode;
  [key: string]: unknown;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface IconButtonProps {
  variant?: 'filled' | 'outlined' | 'gradient' | 'text';
  color?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}

interface NavbarProps {
  fullWidth?: boolean;
  shadow?: boolean;
  blurred?: boolean;
  color?: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface CollapseProps {
  open: boolean;
  children: React.ReactNode;
  [key: string]: unknown;
}

export function Typography({ children, ...props }: TypographyProps) {
  const MTTypographyComponent = MTTypography as unknown as React.ComponentType<TypographyProps>;
  return (
    <MTTypographyComponent {...props}>
      {children}
    </MTTypographyComponent>
  );
}

export function Button({ children, ...props }: ButtonProps) {
  const MTButtonComponent = MTButton as unknown as React.ComponentType<ButtonProps>;
  return (
    <MTButtonComponent {...props}>
      {children}
    </MTButtonComponent>
  );
}

export function Input(props: InputProps) {
  const MTInputComponent = MTInput as unknown as React.ComponentType<InputProps>;
  return <MTInputComponent {...props} />;
}

export function Card({ children, ...props }: CardProps) {
  const MTCardComponent = MTCard as unknown as React.ComponentType<CardProps>;
  return (
    <MTCardComponent {...props}>
      {children}
    </MTCardComponent>
  );
}

export function CardBody({ children, ...props }: CardBodyProps) {
  const MTCardBodyComponent = MTCardBody as unknown as React.ComponentType<CardBodyProps>;
  return (
    <MTCardBodyComponent {...props}>
      {children}
    </MTCardBodyComponent>
  );
}

export function IconButton({ children, ...props }: IconButtonProps) {
  const MTIconButtonComponent = MTIconButton as unknown as React.ComponentType<IconButtonProps>;
  return (
    <MTIconButtonComponent {...props}>
      {children}
    </MTIconButtonComponent>
  );
}

export function Navbar({ children, ...props }: NavbarProps) {
  const MTNavbarComponent = MTNavbar as unknown as React.ComponentType<NavbarProps>;
  return (
    <MTNavbarComponent {...props}>
      {children}
    </MTNavbarComponent>
  );
}

export function Collapse({ children, ...props }: CollapseProps) {
  const MTCollapseComponent = MTCollapse as unknown as React.ComponentType<CollapseProps>;
  return (
    <MTCollapseComponent {...props}>
      {children}
    </MTCollapseComponent>
  );
}

const MaterialTailwindComponents = { Typography, Button, Input, Card, CardBody, IconButton, Navbar, Collapse };
export default MaterialTailwindComponents;