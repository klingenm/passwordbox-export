
result = [["website","name","login","login2","password","category","note"]]; // format for csv file, if you need a different one, make line 20 match it
items = document.getElementsByClassName("bt_edit");
var len;
// go to main view in case it isn't there already, then start.
bt_passwordbox.click();
start = setInterval(function(){
  if(items.length == 0) return;
  len = items.length;
  clearInterval(start);
  processItem(0);
},1);

function processItem(i){
  items[i].click();									// click edit button
  inter = setInterval(function(){					
    if(typeof(username_fill)==undefined) return;	// wait until item loads
    clearInterval(inter);
    console.log( i + "\t"+addSpaces(30,title_fill.value) + addSpaces(30,username_fill.value) + password_fill.value);			// print item to see progress
    result.push( [  url_fill.value, title_fill.value, username_fill.value, "" , password_fill.value,"" , memo_fill.value ]);	// add values to results array to be converted into csv file. Empty values should be empty strings, don't use null or leave blank
    bt_passwordbox.click();							// return to main view
    inter2 = setInterval(function(){
      if(items.length == 0) return;					// wait until main view loads
      clearInterval(inter2);
      if(i<len-1) processItem(++i);					// process next item or export file if done
      else exportToCsv("result.csv",result);
    },1);
  },1); 
}

addSpaces = function(num,str){return str + new Array( Math.max(num - str.length,1) ).join(' ')} // for formatting logging






// Generic function for exporting to csv
function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }