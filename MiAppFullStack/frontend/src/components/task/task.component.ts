import { Component, inject, OnDestroy } from "@angular/core";
import { TaskService } from "../../services/task/task-service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject, Subscription } from "rxjs";

@Component({
 selector: 'app-task-component',
 standalone: true,
 imports: [ReactiveFormsModule, CommonModule],
 template: `
  <div>
    <h2>Tasks Totales: {{ totalTasks | async }}</h2>
    
    <!-- 🟢 LISTADO DE TAREAS RECTIVAS -->
    @for(taskValue of (tasks | async); track taskValue.id) {
      <div style="margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">
        
        <!-- Checkbox para marcar/desmarcar como leída -->
        <input 
          type="checkbox" 
          [checked]="taskValue.isRead" 
          (change)="onMarkAsRead(taskValue.id)"
        >

        <!-- Input dinámico que actualiza el servicio letra por letra -->
        <input 
          type="text" 
          [value]="taskValue.task" 
          (input)="onUpdateText(taskValue.id, $any($event.target).value)"
          [style.textDecoration]="taskValue.isRead ? 'line-through' : 'none'"
          [style.opacity]="taskValue.isRead ? 0.5 : 1"
        >

        <!-- Botón para eliminar -->
        <button type="button" (click)="onDelete(taskValue.id)">❌ Eliminar</button>
      </div>
    } @empty {
      <p>No hay tareas registradas.</p>
    }
  </div>

  <hr style="margin: 20px 0;">

  <!-- 🟢 FORMULARIO PARA CREAR NUEVAS TAREAS -->
  <h2>Crear Nueva Tarea</h2>
  <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
   <div>
      <input type="text" formControlName="task" placeholder="Escribe una tarea...">
      @if(taskControl.invalid && taskControl.touched) {
       @if(taskControl.errors?.["required"]) { <span style="color: red;">La tarea es obligatoria.</span> }
      }
   </div>  

   <div>
     <label>
       <input type="checkbox" formControlName="isRead"> ¿Iniciar como leída?
     </label>
   </div>

   <button type="submit">Guardar Tarea</button>
  </form>
 `
})
export class TaskComponent implements OnDestroy {
 private taskService = inject(TaskService);
 
 // Flujos provenientes del servicio externo
 public tasks = this.taskService.tasks;
 public totalTasks = this.taskService.totalTasks$;

 private textUpdateObserver = new Subject<{ text : string , id : number }>()

 // Control interno del ID autoincremental de manera reactiva (Mantenido bajo tu idea original)
 private idSubject$ = new BehaviorSubject<number>(0);
 public currentId$: Observable<number> = this.idSubject$.asObservable();
 private sub = new Subscription();

 taskForm = new FormGroup({
   task: new FormControl('', Validators.required),
   isRead: new FormControl(false)
 });

 get taskControl() { return this.taskForm.controls.task; }
 get isReadControl() { return this.taskForm.controls.isRead; }

 constructor() {
  this.sub.add(
   this.textUpdateObserver.pipe(
     debounceTime(300),
    distinctUntilChanged((prev, curr) => prev.id === curr.id && prev.text === curr.text)

    ).subscribe(({ id , text }) => {
      this.taskService.updateTaskText(id , text);
    })
  )
  
 }

 onSubmit() {
  if (!this.taskForm.valid) {
   this.taskForm.markAllAsTouched();
   return;
  }
  
  // Añadimos la suscripción a la bolsa para controlarla en el OnDestroy
  this.sub.add(
    this.currentId$.subscribe((id) => {
      const formValue = this.taskForm.getRawValue();
      const response = { 
        id: id,
        task: formValue.task || '', 
        isRead: !!formValue.isRead 
      };
       
      // Enviamos la tarea al estado global del servicio
      this.taskService.addTask(response);
      
      // Reseteamos el formulario de creación
      this.taskForm.reset({ task: '', isRead: false });

      // Emitimos el siguiente ID disponible
      this.idSubject$.next(id + 1);
    })
  );
 }

 // Métodos para interactuar con la lista de tareas directamente en el servicio
 onUpdateText(id: number, text: string): void {
   this.textUpdateObserver.next({ id , text });
 }

 onMarkAsRead(id: number): void {
   this.taskService.markToRead(id);
 }

 onDelete(id: number): void {
   this.taskService.deleteTask(id);
 }

 ngOnDestroy(): void {
  // 🟢 Cerramos todas las mangueras abiertas al destruir el componente
  this.sub.unsubscribe();
  this.idSubject$.complete();
 }
}
