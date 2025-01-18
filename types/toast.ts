export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string | number;
  variant: ToastVariant;
  title: string;
  message?: string;
  onClose?: () => void;
  show?: boolean;
}

export interface ToastContextType {
  showToast: (variant: ToastVariant, title: string, message?: string) => void;
  removeToast: (id: string | number) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}
