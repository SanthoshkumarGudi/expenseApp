// src/components/common/FormWrapper.jsx
export const FormWrapper = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {children}
    </form>
  );
};