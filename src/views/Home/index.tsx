import * as React from "react";
import { Route, Switch, } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  ApplicationState,
  getItemsAction,
  createItemAction,
  removeItemAction,
  updateItemAction,
} from "~/services/store";

import {
  TodoItem,
} from "~/services/api";

export interface TodoItemComponentProps {
  className?: string;
  item: TodoItem;
}

export function TodoItemComponent(props: TodoItemComponentProps) {
  const [item, setItem] = React.useState(props.item);
  const [editing, setEditing] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function setDone(done: boolean) {
    setItem({...item, done});
    dispatch(updateItemAction({
      ...item,
      done,
    }));
  }

  function saveEdit() {
    dispatch(updateItemAction(item));
    setEditing(false);
  }

  function cancelEdit() {
    setItem(props.item);
    setEditing(false);
  }

  function remove() {
    dispatch(removeItemAction(item.id));
  }

  return (
    <div className={props.className}>
      <div className="d-flex align-items-start">
        <div className="mr-2">
          <input
            type="checkbox"
            checked={item.done}
            onChange={e => setDone(e.currentTarget.checked)}/>
        </div>
        {!editing &&
          <div className="text-muted">
            {!item.done &&
              <b>{item.title}</b>
            }
            {item.done &&
              <del>
                <b>{item.title}</b>
              </del>
            }
            <br/>
            <small>
              {item.description}
            </small>
          </div>
        }
        {editing &&
          <div className="w-100 mr-2">
            <input
              className="form-control form-control-sm"
              type="text"
              value={item.title}
              onChange={e => setItem({...item, title: e.currentTarget.value})}
              placeholder={t("label.title")}
              aria-describedby="titleHelp"/>
            <small
              id="titleHelp"
              className="form-text text-muted">
              {t("label.title")}
            </small>
            <textarea
              className="form-control form-control-sm mt-2"
              value={item.description}
              onChange={e => setItem({...item, description: e.currentTarget.value})}
              placeholder={t("label.description")}
              aria-describedby="descriptionHelp"/>
            <small
              id="descriptionHelp"
              className="form-text text-muted">
              {t("label.description")}
            </small>
          </div>
        }
        <div className="d-flex justify-content-end flex-nowrap ml-auto">
          {!editing &&
            <button
              className="btn btn-sm btn-outline-secondary mr-2"
              onClick={() => setEditing(true)}>
              <b>{t("label.edit")}</b>
            </button>
          }
          {editing &&
            <React.Fragment>
              <button
                className="btn btn-sm btn-primary mr-2"
                onClick={() => saveEdit()}>
                <b>{t("label.save")}</b>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary mr-2"
                onClick={() => cancelEdit()}>
                <b>{t("label.cancel")}</b>
              </button>
            </React.Fragment>
          }
          <button
            className="btn btn-sm btn-danger"
            onClick={() => remove()}>
            <b>{t("label.remove")}</b>
          </button>
        </div>
      </div>
    </div>
  );
}


export function TodoList() {
  const [search, setSearch] = React.useState("");
  const items = useSelector((state: ApplicationState) => state.items);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function getItems() {
    try {
      const regex = new RegExp(search);

      return items
        .filter(item => item.title.match(regex));
    } catch {
      return items;
    }
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;

    form.reset();

    dispatch(createItemAction({
      title,
      description: "",
    }));
  }

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between text-muted">
        <b>{`${t("label.list")} - ${t("label.itemWithCount", {count: items.length})}`}</b>
        <div className="form-inline">
          <input
            type="text"
            className="form-control form-control-sm"
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            placeholder={t("label.search")}
            spellCheck={false}/>
        </div>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <form className="row m-0" onSubmit={onFormSubmit}>
            <input
              className="form-control form-control-sm col mr-2"
              type="text"
              name="title"
              placeholder={t("placeholder.todo")}
              autoComplete="off"/>
            <button
              type="submit"
              className="btn btn-sm btn-secondary col-auto">
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              <b>{t("label.add")}</b>
            </button>
          </form>
        </li>
        {getItems().map(item => (
          <li key={item.id} className="list-group-item">
            <TodoItemComponent item={item}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getItemsAction());
  }, []);

  return (
    <main className="container py-4">
      <TodoList/>
    </main>
  );
}
