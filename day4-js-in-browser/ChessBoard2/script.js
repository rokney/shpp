/**
 * Created by rokne on 06.01.2016.
 */
function addBoard() {
    var board = '<tr>';
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
                board += '<td class="black"></td>'
            } else {
                board += '<td class="white"></td>'
            }
        }
        board += '<tr>'
    }
    board += '<tr>'
    document.getElementById("table").innerHTML = board;
}