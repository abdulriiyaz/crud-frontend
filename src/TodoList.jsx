import React, { useState, useEffect } from 'react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [updatedTodo, setUpdatedTodo] = useState('');

    // Fetch all todos from the backend
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        if (newTodo.trim() === '') {
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTodo }),
            });

            if (response.ok) {
                const newTodoItem = await response.json();
                setTodos((prevTodos) => [...prevTodos, newTodoItem]);
                setNewTodo('');
            } else {
                console.error('Error adding todo:', response.status);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== id)
                );
            } else {
                console.error('Error deleting todo:', response.status);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const startEditing = (id, title) => {
        setEditingTodo(id);
        setUpdatedTodo(title);
    };

    const updateTodo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: updatedTodo }),
            });

            if (response.ok) {
                const updatedTodoItem = await response.json();
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? updatedTodoItem : todo
                    )
                );
                setEditingTodo(null);
                setUpdatedTodo('');
            } else {
                console.error('Error updating todo:', response.status);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Todo List</h2>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between"
                    >
                        {editingTodo === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedTodo}
                                    onChange={(e) =>
                                        setUpdatedTodo(e.target.value)
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                                <div className="flex mt-2">
                                    <button
                                        onClick={() => updateTodo(todo.id)}
                                        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingTodo(null)}
                                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="mr-2">{todo.title}</span>
                                <div className="flex">
                                    <button
                                        onClick={() =>
                                            startEditing(todo.id, todo.title)
                                        }
                                        className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                />
                <button
                    onClick={addTodo}
                    className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default TodoList;
