/*fetch('LB.txt')

return response.json();


    const { Name } = data;
    const { Score } = data.score[0];
    const { Date } = data.date; 
    
    
    document.querySelector("Name").innerText = " Name " + data;
    document.querySelector("Score").innerText = " Score " + data.score[0];
    document.querySelector("Date").innerText = " Date " + data.date;
    */
    
    //https://docs.google.com/spreadsheets/d/1-ik98KgnIWWg1V7Gy92_wL2C_-jdzMTzNAaxzULGRSI/edit?usp=sharing
    
const base = 'https://docs.google.com/spreadsheets/d/1-ik98KgnIWWg1V7Gy92_wL2C_-jdzMTzNAaxzULGRSI/gviz/tq?';
const output = document.querySelector('.output');
const query = encodeURIComponent('Select A,B,C where C > 3 limit 20');
const url = base + '&tq=' + query;
    fetch(url)
    .then(res => res.text())
    .then(rep =>{
        const data = JSON.parse(rep.substr(47).slice(0,-2));
        const row = document.createElement('tr');
        output.append(row);
        data.table.cols.forEach((heading)=>{
            const cell = document.createElement('td');
            cell.textContent = heading.label;
            row.append(cell);
        })
        data.table.rows.forEach((main)=>{
            const container = document.createElement('tr');
            output.append(container);
            main.c.forEach((ele)=>{
                const cell = document.createElement('td');
                cell.textContent = ele.v;
                container.append(cell);
            })
        })
    })
    