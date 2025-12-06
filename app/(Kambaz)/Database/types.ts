interface ILesson {
    _id: string;
    name: string;
    description: string;
    module: string;
  }

  interface IModule {
    _id: string;
    name: string;
    description: string;
    course: string;
    lessons?: ILesson[]; 
  }

  export interface IAssignmentData{
    title: string;
    course: string;
    availableDate: string;
    untilDate:string
    dueDate: string;      
    points: number;
    description: string;
  }

  export interface IAssignment extends IAssignmentData {
    _id: string;
    modules: string;
 
  }