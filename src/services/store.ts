import { createStore, Action, applyMiddleware } from "redux";
import ReduxThunk, { ThunkAction } from "redux-thunk";
import {
  Title,
  Description,
  getItems,
  createItem,
  removeItem,
  updateItem,
  TodoItem,
} from "./api";

export interface ApplicationState {
  items: TodoItem[];
}

interface GetItemsAction extends Action<"GET_ITEMS"> {
  items: TodoItem[];
}

interface CreateItemAction extends Action<"CREATE_ITEM"> {
  item: TodoItem;
}

interface RemoveItemAction extends Action<"REMOVE_ITEM"> {
  id: string;
}

interface UpdateItemAction extends Action<"UPDATE_ITEM"> {
  item: TodoItem;
}

type ApplicationAction = GetItemsAction | CreateItemAction | RemoveItemAction | UpdateItemAction;
type ApplicationThunkAction<T> = ThunkAction<T, ApplicationState, never, ApplicationAction>;

const initialApplicationState: ApplicationState = {
  items: [],
};

export function getItemsAction(): ApplicationThunkAction<void> {
  return async (dispatch) => {
    const items = await getItems();

    dispatch({
      type: "GET_ITEMS",
      items,
    });
  };
}

export function createItemAction(data: Title & Description): ApplicationThunkAction<void> {
  return async (dispatch, getState) => {
    const state = getState();
    const item = await createItem(data);

    dispatch({
      type: "CREATE_ITEM",
      item,
    });
  };
}

export function removeItemAction(id: string): ApplicationThunkAction<void> {
  return async (dispatch) => {
    await removeItem(id);

    dispatch({
      type: "REMOVE_ITEM",
      id,
    });
  };
}

export function updateItemAction(item: TodoItem): ApplicationThunkAction<void> {
  return async (dispatch) => {
    const updatedItem = await updateItem(item);

    dispatch({
      type: "UPDATE_ITEM",
      item: updatedItem,
    });
  };
}

function reducer(state: ApplicationState = initialApplicationState, action: ApplicationAction) : ApplicationState {
  switch (action.type) {
    case "CREATE_ITEM": {
      return {
        ...state,
        items: [action.item].concat(state.items)
      };
    };

    case "GET_ITEMS": {
      return {
        ...state,
        items: [...action.items]
      };
    };

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(item => item.id != action.id)
      };
    };

    case "UPDATE_ITEM": {
      const items = [...state.items];
      const index = items.findIndex(item => item.id == action.item.id);

      items[index] = action.item;

      return {
        ...state,
        items,
      };
    };

    default: {
      return state;
    }
  }
}

const configureStore = () => createStore(reducer, initialApplicationState, applyMiddleware(ReduxThunk));
export default configureStore;
