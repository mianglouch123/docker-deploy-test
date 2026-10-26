export interface TaskModel{
 id : number,
 task : string,
 isRead : boolean
}

type LowerCaseModel<T> = {
  [K in keyof T as Lowercase<string & K>]: T[K];
};
type keyTasks = LowerCaseModel<TaskModel>

