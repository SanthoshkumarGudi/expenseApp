import { useLocation, useNavigate } from 'react-router-dom';

export function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const message =
    location.state?.message ||
    'Please check your email to verify your account.';

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-semibold">Verify your email</h1>

      <p className="mt-4 text-gray-600">
        {message}
      </p>

      {email && (
        <p className="mt-2 text-sm text-gray-500">
          Verification email sent to <strong>{email}</strong>
        </p>
      )}

      <button
        onClick={() => navigate('/login')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Go to Login
      </button>
    </div>
  );
}