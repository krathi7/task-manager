document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasks');

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(taskForm);
        fetch('tasks.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            loadTasks();
            taskForm.reset(); 
        })
        .catch(error => console.error('Error:', error));
    });

    function loadTasks() {
        fetch('tasks.php')
        .then(response => response.json())
        .then(tasks => {
            tasksContainer.innerHTML = '';
            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task', task.task_color_class); 
                taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Priority: ${task.priority}</p>
                    <small>${new Date(task.created_at).toLocaleString()}</small>
                    <br>
                    <label>
                        <input type="checkbox" class="chk-complete" data-task-id="${task.id}" ${task.is_completed ? 'checked' : ''}> Mark as Completed
                    </label>
                `;
                tasksContainer.appendChild(taskDiv);

                
                const chkComplete = taskDiv.querySelector('.chk-complete');
                chkComplete.addEventListener('change', function() {
                    const taskId = chkComplete.getAttribute('data-task-id');
                    markTaskCompleted(taskId, chkComplete.checked);
                });
            });
        })
        .catch(error => console.error('Error:', error));
    }

    function markTaskCompleted(taskId, completed) {
        const action = completed ? 'complete_task' : 'uncomplete_task';
        fetch('tasks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=${action}&task_id=${taskId}`
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            loadTasks(); 
        })
        .catch(error => console.error('Error:', error));
    }

    loadTasks(); 
});

