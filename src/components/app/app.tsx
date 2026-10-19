import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  IngredientDetails,
  OrderInfo,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import {
  Routes,
  Route,
  useLocation,
  useMatch,
  useNavigate,
} from 'react-router-dom';

import type { Location } from 'react-router-dom';
import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

import { checkUserAuth } from '../../services/userSlice';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );

  const ingredientsError = useSelector(
    (state) => state.ingredients.error
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Нет ингредиентов
      </p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const background = (
    location.state as { background?: Location } | null
  )?.background;

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');

  const number =
    feedOrderMatch?.params.number ??
    profileOrderMatch?.params.number;

  const parsedNumber = Number(number);

  const orderTitle =
    Number.isSafeInteger(parsedNumber) && parsedNumber > 0
      ? `#${String(parsedNumber).padStart(6, '0')}`
      : 'Заказ';

  const closeModal = (): void => {
    navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />

        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <section className={styles.detailPageWrap}>
              <h1
                className={`${styles.detailHeader} text text_type_main-large`}
              >
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </section>
          }
        />

        <Route
          path="/feed/:number"
          element={
            <section className={`${styles.detailPageWrap} ${styles.orderDetailPage}`}>
              <h1
                className={`${styles.detailHeader} text text_type_digits-default`}
              >
                {orderTitle}
              </h1>
              <OrderInfo />
            </section>
          }
        />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <section className={`${styles.detailPageWrap} ${styles.orderDetailPage}`}>
                <h1
                className={`${styles.detailHeader} text text_type_digits-default`}
              >
                {orderTitle}
              </h1>
                <OrderInfo />
              </section>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title="Детали ингредиента"
                onClose={closeModal}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={
              <Modal
                variant="order"
                title={
                  <span className="text text_type_digits-default">
                    {orderTitle}
                  </span>
                }
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal
                  variant="order"
                  title={
                    <span className="text text_type_digits-default">
                      {orderTitle}
                    </span>
                  }
                  onClose={closeModal}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};