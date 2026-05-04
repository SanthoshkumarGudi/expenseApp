export const FormError = ({ message }) => {
  if (!message) return null;
  return <p style={{ color: '#d32f2f', textAlign: 'center', marginTop: 8 }}>{message}</p>;
};