import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import orderDetailsReducer from './orderDetailsSlice';
import userReducer from './userSlice';
import profileOrdersReducer from './profileOrdersSlice';
import orderReducer from './orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer,
  order: orderReducer,
});
