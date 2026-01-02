import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=> import('./features/tasks/pages/tasks-board/tasks-board.component')
        .then(m=>m.TasksBoardComponent)
    }
];
