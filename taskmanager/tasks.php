<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "task_manager";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["action"]) && $_POST["action"] === "create_task") {
        $title = $_POST["title"];
        $description = $_POST["description"];
        $priority = $_POST["priority"];
        $sql = "INSERT INTO tasks (title, description, priority) VALUES ('$title', '$description', '$priority')";

        if ($conn->query($sql) === TRUE) {
            echo "New task created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    elseif (isset($_POST["action"]) && ($_POST["action"] === "complete_task" || $_POST["action"] === "uncomplete_task")) {
        $taskId = $_POST["task_id"];
        $isCompleted = $_POST["action"] === "complete_task" ? 1 : 0;
        $sql = "UPDATE tasks SET is_completed = $isCompleted WHERE id = $taskId";

        if ($conn->query($sql) === TRUE) {
            echo "Task updated successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}


$sql = "SELECT * FROM tasks";
$result = $conn->query($sql);

$tasks = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tasks[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'priority' => $row['priority'],
            'created_at' => $row['created_at'],
            'is_completed' => (bool) $row['is_completed'],
            'task_color_class' => $row['is_completed'] ? 'completed-task' : 'pending-task'
        ];
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($tasks);
?>

