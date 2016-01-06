/**
 * Created by rokne on 06.01.2016.
 */

function addBoard() {
    var board = document.getElementById("board"),
        block = board.getContext('2d');
    board.height = 300;
    board.width = 300;
    block.strokeRect(0, 0, 300, 300);
    block.fillStyle = '#000';
    block.fillRect(10, 10, 280, 280);
    for (i = 0; i < 8; i += 2) {
        for (j = 0; j < 8; j += 2) {
            block.clearRect(10 + i * 35, 10 + j * 35, 35, 35);
            block.clearRect(10 + (i + 1) * 35, 10 + (j + 1) * 35, 35, 35);
        }
    }
}

