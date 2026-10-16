import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/userSlice';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isLoading) return;

    try {
      await dispatch(
        registerUser({
          name: userName,
          email,
          password,
        })
      ).unwrap();

      navigate('/');
    } catch {}
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
