"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

interface Todo {
  id: string;
  title: string;
}

interface RootState {
  todosReducer: {
    todos: Todo[];
    todo: Todo;
  };
}

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex flex-row-reverse justify-content-between gap-5">
      <div className="d-flex flex-row-reverse gap-2">
        <Button
          variant="success"
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
        >
          Add
        </Button>
        <Button
          variant="warning"
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>
      </div>
      <FormControl
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        style={{
          width: "160px",
        }}
      />
    </ListGroupItem>
  );
}
