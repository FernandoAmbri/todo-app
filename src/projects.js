/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import { isToday } from "date-fns";

export default class Projects {
  constructor() {
    this.projects = [];
  }

  getProjects() {
    return this.projects;
  }

  setProjects(projectsArray) {
    this.projects = projectsArray;
  }

  getProject(name) {
    const project = this.projects.find((item) => item.name === name);
    return project || false;
  }

  addProject(project) {
    if (!this.getProject(project.getName())) {
      this.projects.push(project);
    }
  }

  getProjectIndex(projectName) {
    return this.projects.findIndex(
      (project) => project.getName() === projectName
    );
  }

  removeProject(projectName) {
    this.projects = this.projects.filter(
      (item) => item.getName() !== projectName
    );
  }

  addTodoFromProject(todo) {
    const todayTitle = "Actuales";
    const project = this.getProject(todo.getProjectName());
    const today = this.getProject(todayTitle);
    const projectAdded = project ? project.addTodo(todo) : false;

    if (projectAdded) {
      todo.searchTodo = {
        projectSearch: todo.getProjectName(),
        todoTitle: todo.getTitle(),
      };
    } else {
      todo.setProjectName("");
    }

    if (isToday(new Date(todo.getDueDate()))) {
      today.todos.push(todo);
    }
  }

  findTodoToday(project, todoTitle) {
    const todayTitle = "Actuales";
    const today = this.getProject(todayTitle);
    let indexTodo = -1;

    today.todos.forEach((item, i) => {
      if (item.hasOwnProperty("searchTodo")) {
        if (
          item.searchTodo.projectSearch === project.getName() &&
          item.searchTodo.todoTitle === todoTitle
        ) {
          indexTodo = i;
        }
      }
    });
    return indexTodo;
  }

  updateTodoToday(index, todoObj, projectName) {
    const todayTitle = "Actuales";
    const today = this.getProject(todayTitle);
    const project = this.getProject(projectName);
    const todoTitle = project.getTodos()[index].getTitle();
    const lowestIndex = 0;
    let updatedTodo = null;

    if (isToday(new Date(todoObj.getDueDate()))) {
      const todoIndex = this.findTodoToday(project, todoTitle);
      todoObj.searchTodo = {
        projectSearch: project.getName(),
        todoTitle: todoObj.getTitle(),
      };
      if (todoIndex >= lowestIndex) {
        today.todos[todoIndex] = todoObj;
      } else {
        today.todos.push(todoObj);
      }
      updatedTodo = project.updateTodo(index, todoObj);
      if (updatedTodo === false) {
        today.removeTodo(todoObj.getTitle());
        this.addTodoFromProject(todoObj);
      }
    } else {
      updatedTodo = project.updateTodo(index, todoObj);
      const todoIndex = this.findTodoToday(project, todoTitle);
      if (todoIndex >= lowestIndex) {
        today.removeTodo(todoTitle);
      }
      if (updatedTodo === false) {
        this.addTodoFromProject(todoObj);
      }
    }
  }

  updateTodoFromToday(index, todoObj) {
    const todayTitle = "Actuales";
    const todoProperty = "searchTodo";
    const today = this.getProject(todayTitle);
    const todoValues = today.getTodos()[index];

    if (todoValues.hasOwnProperty(todoProperty)) {
      todoObj.searchTodo = todoValues.searchTodo;
    }

    if (todoObj.hasOwnProperty(todoProperty)) {
      const { projectSearch, todoTitle } = todoObj.searchTodo;
      const project = this.getProject(projectSearch);
      const indexSearch = project.getIndexTodo(project.getTodo(todoTitle));
      const updatedTodo = project.updateTodo(indexSearch, todoObj);

      if (updatedTodo === false) {
        today.removeTodo(todoTitle);
        this.addTodoFromProject(todoObj);
        return;
      }
    } else {
      const project = this.getProject(todoObj.getProjectName());
      const todoAdded = project ? project.addTodo(todoObj) : false;
      if (todoAdded) {
        todoObj.searchTodo = {
          projectSearch: todoObj.getProjectName(),
          todoTitle: todoObj.getTitle(),
        };
      }
    }

    if (isToday(new Date(todoObj.getDueDate()))) {
      today.todos[index] = todoObj;
    } else {
      today.removeTodo(todoValues.getTitle());
    }
  }

  deleteTodoFromToday(index) {
    const todayTitle = "Actuales";
    const todoProperty = "searchTodo";
    const today = this.getProject(todayTitle);
    const todoObj = today.getTodos()[index];

    if (todoObj.hasOwnProperty(todoProperty)) {
      const { projectSearch, todoTitle } = todoObj.searchTodo;
      const project = this.getProject(projectSearch);
      if (project) {
        project.removeTodo(todoTitle);
      }
    }
    today.removeTodo(todoObj.getTitle());
  }

  deleteAllTodos(projectName) {
    const project = this.getProject(projectName);
    if (project) {
      project.getTodos().forEach((todo, i) => {
        if (isToday(new Date(todo.getDueDate()))) {
          const index = i;
          this.deleteTodoToday(index, projectName, true);
        }
      });
    }
  }

  deleteTodoToday(index, projectName) {
    const todayTitle = "Actuales";
    const project = this.getProject(projectName);
    const today = this.getProject(todayTitle);
    const todoTitle = project.getTodos()[index].getTitle();
    const indexTodo = this.findTodoToday(project, todoTitle);

    if (indexTodo >= 0) today.removeTodo(todoTitle);

    if (arguments.length < 3) project.removeTodo(todoTitle);
  }
}
