import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/userSlice';

import type { TRegisterData } from '../../utils/burger-api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.user.isLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (!user || !isFormChanged || isLoading) return;

    const updatedData: Partial<TRegisterData> = {};

    if (formValue.name !== user.name) {
      updatedData.name = formValue.name;
    }

    if (formValue.email !== user.email) {
      updatedData.email = formValue.email;
    }

    if (formValue.password) {
      updatedData.password = formValue.password;
    }

    try {
      const updatedUser = await dispatch(updateUser(updatedData)).unwrap();

      setFormValue({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '',
      });
    } catch {}
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
