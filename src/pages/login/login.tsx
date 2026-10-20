import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);

  const from = location.state?.from;
  const redirectPath = from
    ? `${from.pathname}${from.search || ''}${from.hash || ''}`
    : '/';

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isLoading) return;

    try {
      await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();

      navigate(redirectPath, { replace: true });
    } catch {
      // Ошибка сохраняется в Redux и отображается в форме
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
