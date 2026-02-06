
export interface ForgotPasswordFormData {
  email: string;
  termsAccepted: boolean;
}


export interface ForgotPasswordValidationErrors {
  email?: string;
  termsAccepted?: string;
  general?: string;
}


export interface ForgotPasswordComponentProps {
  initialEmail?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: any) => void;
  redirectTo?: string;
  showLoginLink?: boolean;
  customStyles?: {
    container?: React.CSSProperties;
    form?: React.CSSProperties;
    input?: React.CSSProperties;
    button?: React.CSSProperties;
  };
}


export interface ForgotPasswordComponentState {
  formData: ForgotPasswordFormData;
  validationErrors: ForgotPasswordValidationErrors;
  isLoading: boolean;
  isSubmitted: boolean;
  showSuccess: boolean;
}