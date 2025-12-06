
import React, { useState } from 'react';
import { CheckSquare, Clock, Filter, Plus, UserCircle, X, Trash2 } from 'lucide-react';
import { WorkpaperTask, Finding } from '../web/types';

interface Props {
  tasks: WorkpaperTask[];
  findings: Finding[];
  onAddTask: (task: WorkpaperTask) => void;
  onUpdateTask: (task: WorkpaperTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

type FilterType = 'ALL' | 'MINE';

export default function WorkpapersView({ tasks, findings, onAddTask, onUpdateTask, onDeleteTask }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  
  // Mock current user
  const CURRENT_USER = 'John Doe'; 

  const getStatusColor = (status: WorkpaperTask['status']) => {
    switch(status) {
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: WorkpaperTask['priority']) => {
    switch(priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: WorkpaperTask = {
        id: `t-${Date.now()}`,
        engagementId: 'eng-123',
        title: newTaskTitle,
        status: 'OPEN',
        priority: 'MEDIUM',
        assignee: CURRENT_USER,
        dueDate: new Date().toISOString()
    };
    
    onAddTask(newTask);
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  const cycleStatus = (task: WorkpaperTask) => {
    const statuses: WorkpaperTask['status'][] = ['OPEN', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdateTask({ ...task, status: nextStatus });
  };

  const filteredTasks = tasks.filter(task => {
      if (activeFilter === 'MINE') return task.assignee === CURRENT_USER;
      return true;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Workpapers & Tasks</h2>
          <p className="text-sm text-slate-500">Manage audit procedures and finding resolutions.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">New Workpaper Task</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAddTask}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g. Verify Q1 Bank Recs"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-200 flex gap-2">
            <button 
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === 'ALL' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                All Tasks
            </button>
            <button 
                onClick={() => setActiveFilter('MINE')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === 'MINE' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                My Tasks
            </button>
            <div className="flex-1"></div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-md">
                <Filter size={16} />
            </button>
         </div>
         <ul className="divide-y divide-slate-100">
           {filteredTasks.length === 0 && (
               <li className="p-8 text-center text-slate-400 text-sm">No tasks found.</li>
           )}
           {filteredTasks.map(task => {
             const linkedFinding = task.findingId ? findings.find(f => f.id === task.findingId) : null;
             
             return (
               <li key={task.id} className="group p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                 <button 
                    onClick={() => cycleStatus(task)}
                    className={`pt-1 transition-colors hover:text-green-600 ${task.status === 'DONE' ? 'text-green-600' : 'text-slate-300'}`}
                    title="Click to toggle status"
                 >
                   {task.status === 'DONE' ? (
                     <div className="bg-green-100 p-1 rounded">
                       <CheckSquare size={20} />
                     </div>
                   ) : (
                     <div className="bg-slate-100 p-1 rounded">
                       <CheckSquare size={20} />
                     </div>
                   )}
                 </button>
                 
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                      <h4 
                        className={`text-sm font-medium cursor-pointer hover:text-blue-600 ${task.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-900'}`}
                        onClick={() => cycleStatus(task)}
                      >
                        {task.title}
                      </h4>
                      <button 
                        onClick={() => cycleStatus(task)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase transition-colors hover:opacity-80 ${getStatusColor(task.status)}`}
                      >
                        {task.status.replace('_', ' ')}
                      </button>
                   </div>
                   {task.description && <p className="text-sm text-slate-500 mt-0.5 truncate">{task.description}</p>}
                   {linkedFinding && (
                     <div className="mt-1 flex items-center gap-1 text-xs text-red-600 bg-red-50 inline-block px-1.5 py-0.5 rounded border border-red-100">
                       <span className="font-semibold">Linked Finding:</span> {linkedFinding.code}
                     </div>
                   )}
                 </div>

                 <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <UserCircle size={14} />
                      <span>{task.assignee || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-[90px]">
                      <Clock size={14} />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className={`font-semibold w-16 text-right ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </div>
                    {onDeleteTask && (
                        <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Task"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                 </div>
               </li>
             );
           })}
         </ul>
      </div>
    </div>
  );
}
