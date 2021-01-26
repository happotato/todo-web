export const HOST = process.env.API_HOST as string;

export interface Item {
  id: string;
  createdAt: string;
  lastModified: string;
}

export interface Title {
  title: string;
}

export interface Description {
  description: string;
}

export interface TodoItem extends Item, Title, Description {
  done: boolean;
}

export async function getItems() : Promise<TodoItem[]> {
  const url = new URL("/api/todos", HOST);
  const res = await fetch(url.toString());

  return await res.json();
}

export async function createItem(data?: Title & Description) : Promise<TodoItem> {
  const url = new URL("/api/todos", HOST);
  const res = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
  });

  return await res.json();
}

export async function removeItem(id: string) : Promise<void> {
  const url = new URL(`/api/todos/${id}`, HOST);

  await fetch(url.toString(), {
    method: "DELETE"
  });
}

export async function updateItem(item: TodoItem) : Promise<TodoItem> {
  const url = new URL(`/api/todos/${item.id}`, HOST);
  const res = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json"
    },
  });

  return await res.json();
}
