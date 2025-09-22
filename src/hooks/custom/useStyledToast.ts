import { toast } from 'sonner';

type TToastMessage = string | React.ReactNode;

const baseStyle = {
  padding: '14px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  fontWeight: '700'
};

const styles = {
  success: {
    ...baseStyle,
    border: '2px solid #28a745',
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  error: {
    ...baseStyle,
    border: '2px solid #dc3545',
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  warning: {
    ...baseStyle,
    border: '2px solid #ffc107',
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  info: {
    ...baseStyle,
    border: '2px solid #5d2de6',
    backgroundColor: '#5d2de620',
    color: '#5d2de6'
  }
};

export const useStyledToast = () => {
  return {
    success: (message: TToastMessage, options = {}) =>
      toast.success(message, { style: styles.success, ...options }),

    error: (message: TToastMessage, options = {}) =>
      toast.error(message, { style: styles.error, ...options }),

    warning: (message: TToastMessage, options = {}) =>
      toast.warning(message, { style: styles.warning, ...options }),

    info: (message: TToastMessage, options = {}) =>
      toast.info(message, { style: styles.info, ...options })
  };
};
