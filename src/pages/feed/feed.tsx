import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/feedSlice';

const REFRESH_INTERVAL = 10000;

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);
  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    dispatch(fetchFeeds());

    const interval = setInterval(() => {
      dispatch(fetchFeeds());
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium">Не удалось загрузить ленту заказов</p>
    );
  }

  if (!orders.length) {
    return <p className="text text_type_main-medium">Заказов пока нет</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
