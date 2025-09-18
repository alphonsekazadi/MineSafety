export class FreeCellVisitor {
    constructor(matrix) {
        this.matrix = matrix;
        this.row = matrix.length - 1;
        this.column = matrix.length - 1;
        this.startColumn = this.column;
        this.dir = -1;
        this.c = 0;
    }

    move() {
        this.row += this.dir * this.c;
        this.c ^= 1;
        this.column = this.startColumn - this.c;
    }

    getNextCell() {
        while (this.matrix[this.row][this.column] !== undefined) {
            this.move();

            if (this.row < 0 || this.row >= this.matrix.length) {
                this.dir = -this.dir;
                this.startColumn -= this.startColumn !== 8 ? 2 : 3;
                this.column = this.startColumn;
                this.row = this.dir < 0 ? this.matrix.length - 1 : 0;
            }
        }

        return {
            row: this.row,
            column: this.column
        };
    }

    getNextRemainderCell() {
        this.move();

        if (this.matrix[this.row][this.column] === undefined) {
            return {
                row: this.row,
                column: this.column
            };
        }
    }
}
