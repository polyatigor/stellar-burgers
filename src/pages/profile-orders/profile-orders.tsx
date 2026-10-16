import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/profileOrdersSlice';

const REFRESH_INTERVAL = 10000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders.orders);

  const isLoading = useSelector((state) => state.profileOrders.isLoading);

  const error = useSelector((state) => state.profileOrders.error);

  useEffect(() => {
    dispatch(fetchProfileOrders());

    const interval = setInterval(() => {
      dispatch(fetchProfileOrders());
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium">
        Не удалось загрузить историю заказов: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
