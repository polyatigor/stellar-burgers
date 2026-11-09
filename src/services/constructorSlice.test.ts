import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import type { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: '123',
  id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'test-image.png',
  image_large: 'test-image-large.png',
  image_mobile: 'test-image-mobile.png'
};

const mockFilling: TConstructorIngredient = {
  ...mockBun,
  _id: '456',
  id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main'
};

const mockFillingTwo: TConstructorIngredient = {
  ...mockBun,
  _id: '789',
  id: 'main-2',
  name: 'Вторая начинка',
  type: 'main'
};

const mockBunTwo: TConstructorIngredient = {
  ...mockBun,
  _id: '124',
  id: 'bun-2',
  name: 'Вторая булка'
};

describe('Тестирование constructorSlice', () => {
  test('Возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Добавляет булку в конструктор', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const state = constructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    expect(state).toEqual({
      bun: mockBun,
      ingredients: []
    });
  });

  test('Добавляет начинку в конструктор', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const state = constructorReducer(
      initialState,
      addIngredient(mockFilling)
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [mockFilling]
    });
  });

  test('Удаляет выбранную начинку из конструктора', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling, mockFillingTwo]
    };

    const state = constructorReducer(
      initialState,
      removeIngredient(mockFilling.id)
    );

    expect(state).toEqual({
      bun: mockBun,
      ingredients: [mockFillingTwo]
    });
  });

  test('Изменяет порядок начинок в конструкторе', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling, mockFillingTwo]
    };

    const state = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state).toEqual({
      bun: mockBun,
      ingredients: [mockFillingTwo, mockFilling]
    });
  });

  test('Очищает конструктор после оформления заказа', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling, mockFillingTwo]
    };

    const state = constructorReducer(
      initialState,
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Не изменяет конструктор при неверных индексах', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling, mockFillingTwo]
    };

    const stateWithNegativeIndex = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: -1, toIndex: 0 })
    );

    expect(stateWithNegativeIndex).toEqual(initialState);

    const stateWithLargeIndex = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: 10, toIndex: 0 })
    );

    expect(stateWithLargeIndex).toEqual(initialState);
  });

  test('Заменяет булку и сохраняет все начинки', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling, mockFillingTwo]
    };

    const state = constructorReducer(
      initialState,
      addIngredient(mockBunTwo)
    );

    expect(state).toEqual({
      bun: mockBunTwo,
      ingredients: [mockFilling, mockFillingTwo]
    });
  });
});