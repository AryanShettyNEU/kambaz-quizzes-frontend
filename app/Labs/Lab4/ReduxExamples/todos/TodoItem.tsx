"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

interface Todo {
  id: string;
  title: string;
}

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem
      key={todo.id}
      className="d-flex flex-row-reverse align-items-center justify-content-between"
    >
      <div className="d-flex flex-row-reverse gap-2">
        <Button
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
          variant="danger"
        >
          Delete
        </Button>
        <Button onClick={() => dispatch(setTodo(todo))} id="wd-set-todo-click">
          Edit
        </Button>
      </div>
      {todo.title}
    </ListGroupItem>
  );
}
