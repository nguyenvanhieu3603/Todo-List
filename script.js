class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const taskInput = document.getElementById('taskInput');
        const addTaskButton = document.querySelector('.input-section button');
        
        taskInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.addTaskFromInput();
            }
        });

        addTaskButton.addEventListener('click', () => {
            this.addTaskFromInput();
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTaskFromInput() {
        const taskInput = document.getElementById('taskInput');
        const taskName = taskInput.value.trim();
        
        if (taskName) {
            this.addTask(taskName);
            taskInput.value = '';
            taskInput.focus();
        }
    }

    addTask(taskName) {
        const task = {
            id: Date.now(),
            name: taskName,
            status: 'pending',
            createdAt: new Date().toISOString(),
            completedAt: null // Thêm trường completedAt
        };
        this.tasks.push(task);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    updateTask(id, newName) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.name = newName;
            task.updatedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    updateStatus(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = newStatus;
            
            // Nếu đánh dấu hoàn thành, thêm ngày hoàn thành
            if (newStatus === 'completed') {
                task.completedAt = new Date().toISOString();
            } else {
                // Nếu thay đổi trạng thái khác, xóa ngày hoàn thành
                task.completedAt = null;
            }
            
            task.updatedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    renderTasks(filter = 'all') {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const filteredTasks = this.tasks.filter(task => {
            if (filter === 'all') return true;
            return task.status === filter;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            
            const createdDate = new Date(task.createdAt).toLocaleString();
            
            // Định dạng ngày hoàn thành
            const completedDateHtml = task.completedAt 
                ? `<small class="task-completed-date">Hoàn thành: ${new Date(task.completedAt).toLocaleString()}</small>` 
                : '';
            
            li.innerHTML = `
                <div class="task-content">
                    <span class="${task.status === 'completed' ? 'completed' : ''}">${task.name}</span>
                    <small class="task-date">Tạo lúc: ${createdDate}</small>
                    ${completedDateHtml}
                </div>
                <div class="task-actions">
                    <button onclick="taskManager.updateStatus(${task.id}, 'in-progress')">Đang Tiến Hành</button>
                    <button onclick="taskManager.updateStatus(${task.id}, 'completed')">Hoàn Thành</button>
                    <button onclick="editTask(${task.id}, '${task.name}')">Sửa</button>
                    <button onclick="taskManager.deleteTask(${task.id})">Xóa</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
}

// Khởi tạo taskManager
const taskManager = new TaskManager();
taskManager.renderTasks();

function editTask(id, currentName) {
    const newName = prompt('Nhập tên nhiệm vụ mới:', currentName);
    if (newName && newName.trim() !== '') {
        taskManager.updateTask(id, newName.trim());
    }
}

function filterTasks(status) {
    taskManager.renderTasks(status);
}
