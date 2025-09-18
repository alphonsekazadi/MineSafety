export const drawTable = (data) => {
    let result = ``;

   for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
       const row = data[rowIndex];
       result += new Array(row.cells.length * 4).fill('-').join('');
       result += `\n|`;
       
       for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
            const cell = data[rowIndex].cells[colIndex];
            const caption = cell ? cell.caption.substring(0, 3) : '';
            result += `${caption}${new Array(3 - caption.length).fill(' ').join('')}|`;
       }
       result += `\n`;
   }

   return result;
}
