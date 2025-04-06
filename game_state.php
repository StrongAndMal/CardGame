<?php
header('Content-Type: application/json');

// Enable CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$dbFile = 'game_data.db';

// Initialize SQLite database if it doesn't exist
if (!file_exists($dbFile)) {
    $db = new SQLite3($dbFile);
    $db->exec('CREATE TABLE IF NOT EXISTS high_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT,
        score INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');
} else {
    $db = new SQLite3($dbFile);
}

// Handle different API endpoints
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'save_score':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $playerName = $data['player_name'] ?? 'Anonymous';
            $score = $data['score'] ?? 0;
            
            $stmt = $db->prepare('INSERT INTO high_scores (player_name, score) VALUES (:name, :score)');
            $stmt->bindValue(':name', $playerName, SQLITE3_TEXT);
            $stmt->bindValue(':score', $score, SQLITE3_INTEGER);
            $stmt->execute();
            
            echo json_encode(['success' => true]);
        }
        break;
        
    case 'get_high_scores':
        $result = $db->query('SELECT player_name, score, date FROM high_scores ORDER BY score DESC LIMIT 10');
        $scores = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $scores[] = $row;
        }
        echo json_encode($scores);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

$db->close();
?> 