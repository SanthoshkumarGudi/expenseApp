// FormError.jsx
export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ color: 'red', marginTop: 12, textAlign: 'center', fontSize: '0.9rem' }}>
      {typeof message === 'string' ? message : 'An error occurred'}
    </div>
  );
};