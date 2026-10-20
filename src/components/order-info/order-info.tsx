import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/orderDetailsSlice';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector((state) => state.orderDetails.order);

  const isLoading = useSelector((state) => state.orderDetails.isLoading);

  const error = useSelector((state) => state.orderDetails.error);

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderNumber = Number(number);
  const isValidNumber = Number.isSafeInteger(orderNumber) && orderNumber > 0;

  useEffect(() => {
    if (isValidNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, isValidNumber]);

  const orderInfo = useMemo(() => {
    if (
      !isValidNumber ||
      !orderData ||
      orderData.number !== orderNumber ||
      !ingredients.length
    ) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients, orderNumber, isValidNumber]);

  if (!isValidNumber) {
    return <p className="text text_type_main-medium">Некорректный номер заказа</p>;
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className="text text_type_main-medium">Не удалось загрузить заказ: {error}</p>
    );
  }

  if (!orderInfo) {
    return <p className="text text_type_main-medium">Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
