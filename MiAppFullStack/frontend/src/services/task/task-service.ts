import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";

export interface TaskModel {
  id: number;
  task: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksState$ = new BehaviorSubject<TaskModel[]>([]);
  public errors: string[] = [];
  public tasks: Observable<TaskModel[]> = this.tasksState$.asObservable(); 
  
  public totalTasks$: Observable<number> = this.tasks.pipe(
    map(tasks => tasks.length)
  );
  
  addTask(task: TaskModel): void {
    const { id, task: taskText, isRead } = task;

    if (taskText.trim() === "" || typeof isRead !== "boolean") {
      this.errors.push("error al agregar la task");
      return;
    }

    const currTasks = this.tasksState$.value;
    this.tasksState$.next([...currTasks, task]);
  }

  // 🟢 NUEVO MÉTODO: Actualiza el texto de una tarea específica en tiempo real
  updateTaskText(taskID: TaskModel["id"], newText: string): void {
    const currTasks = this.tasksState$.value;
    const updatedTasks = currTasks.map((t) => 
      t.id === taskID ? { ...t, task: newText } : t
    );
    this.tasksState$.next(updatedTasks);
  }

  markToRead(taskID: TaskModel["id"]): void {
    if (!taskID && taskID !== 0) {
      this.errors.push("no hay task enviada.");
      return; 
    }

    const currTasks = this.tasksState$.value;
    const findTask = currTasks.find((t) => t.id === taskID);

    if (!findTask) {
      this.errors.push("Task no encontrada");
      return;
    }

    const updatedTasks = currTasks.map((t) => 
      t.id === taskID ? { ...t, isRead: !t.isRead } : t // Alterna entre true/false
    );
    this.tasksState$.next(updatedTasks);
  }

  deleteTask(taskID: TaskModel["id"]): void {
    if (!taskID && taskID !== 0) {
      this.errors.push("Task no enviada.");
      return;
    }

    const currTasks = this.tasksState$.value;
    const findTask = currTasks.find((t) => t.id === taskID);

    if (!findTask) {
      this.errors.push("Task no encontrada");
      return;
    }

    const filteredTasks = currTasks.filter((t) => t.id !== taskID);
    this.tasksState$.next(filteredTasks);
  }
}
