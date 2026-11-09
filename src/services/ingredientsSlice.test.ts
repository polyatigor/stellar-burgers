import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  test('Возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('Устанавливает состояние загрузки при pending', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: 'Предыдущая ошибка',
    };

    const action = fetchIngredients.pending('test-request', undefined);

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('Сохраняет ингредиенты при fulfilled', () => {
    const mockIngredients = [
      {
        _id: '123',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 200,
        price: 100,
        image: 'test-image.png',
        image_large: 'test-image-large.png',
        image_mobile: 'test-image-mobile.png',
      },
    ];

    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'test-request',
      undefined
    );

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null,
    });
  });

  test('Сохраняет сообщение об ошибке при rejected', () => {
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.rejected(
      new Error('Ошибка сервера'),
      'test-request',
      undefined
    );

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера',
    });
  });
});