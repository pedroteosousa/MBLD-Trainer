var memos = []
var date = new Date()
var memoTime = 0
var finished = 0

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
var randomLetter = function (last) {
	var letter =  String.fromCharCode(randomInt(65, 65+23))
	if (letter == last) return randomLetter(last)
	else return letter
}
var onlyLetters = function (str) {
	var newStr = ""
	for (var i in str) {
		if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 65+23) newStr += str[i]
	}
	return newStr
}
var copyOfMemo = function () {
	var temp = []
	for (var i in memos) {
		temp.push(memos[i].slice(0))
	}
	return temp
}

//timer functions
var msToTime = function (duration) {
	    var milliseconds = parseInt((duration%1000)/100)
		        , seconds = parseInt((duration/1000)%60)
				        , minutes = parseInt((duration/(1000*60))%60)
						        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
	    minutes = (minutes < 10) ? "0" + minutes : minutes;
		    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
var updateTimer = function () {
	if (finished) return
	document.getElementById("timer").innerHTML = msToTime(getTime())	
	setTimeout(function() {updateTimer()}, 100);
}
var startTimer = function () {
	date = new Date()
	updateTimer()
}
var getTime = function () {
	return (new Date()).getTime() - date.getTime()
}

//memo handling functions
var generateLetters = function (size) {
	var letters = ""
	var last = 0
	for (var i = 0; i<size; i++) {
		last = randomLetter(last)
		letters += last
	}
	return letters
}
var generateMemo = function () {
	var a = randomInt(6, 10)
	var b = randomInt(9, 18)
	if (a % 2 != b % 2) b++
	return [generateLetters(a), generateLetters(b)]
}
var createLine = function (part, option) {
	var finalString = ""
	var i = 0
	for (var k in part) {
		if (option == null) finalString += part[k]
		else if (option[k] == "+") finalString += '<span id="green">' + part[k] + '</span>'
		else if (option[k] == "-") finalString += '<span id="red">' + part[k] + '</span>' 
		i++
		if (i % 2 == 0) finalString += " "
	}
	return finalString
}
var createInputTable = function () {
	var tableCode = '<table class="table table-bordered"><thead><tr><th scope="col">#</th><th scope="col">Corners</th><th scope="col">Edges</th></tr></thead><tbody>'
	for (var i in memos) {
		tableCode += '<tr><th scope="row">' + (parseInt(i) + 1).toString() + '</th>'
		for (var j in memos[i]) {
			tableCode += '<td>' + '<input type="text" class="form-control" name="memo_input"/>' + '</td>'
		}
		tableCode += '</tr>'
	}
	tableCode += '</tbody></table>'
	return tableCode
}
var createTable = function (option) {
	var tableCode = '<table class="table table-bordered"><thead><tr><th scope="col">#</th><th scope="col">Corners</th><th scope="col">Edges</th></tr></thead><tbody>'
	for (var i in memos) {
		tableCode += '<tr><th scope="row">' + (parseInt(i) + 1).toString() + '</th>'
		for (var j in memos[i]) {
			if (option != undefined) tableCode += '<td>' + createLine(memos[i][j], option[i][j]) + '</td>'
			else tableCode += '<td>' + createLine(memos[i][j], undefined) + '</td>'
		}
		tableCode += '</tr>'
	}
	tableCode += '</tbody></table>'
	return tableCode
}
var checkMemo = function (input) {
	options = copyOfMemo()
	for (var i in memos) {
		for (var j in memos[i]) {
			var temp = ""
			for (var k in memos[i][j]) {
				if (input[i][j].length < k || input[i][j][k] != memos[i][j][k]) {
					temp += "-"
				}
				else temp += "+"
			}
			options[i][j] = temp
		}
	}
	return options
}

//-----------
var start = function () {
	finished = 0
	reset()
	var size = parseInt(prompt("How many cubes?"))
	console.log(size)
	for (var i = 0; i<size; i++) {
		memos.push(generateMemo())
	}
	startTimer()
	
	document.getElementById("table").innerHTML = createTable()
	document.getElementById("time_table").hidden = false
	//document.getElementById("timer").hidden = false
	document.getElementById("start").hidden = true
	document.getElementById("ready").hidden = false
}
var ready = function () {
	memoTime = getTime()
	document.getElementById("memo_time").innerHTML = msToTime(memoTime)	
	document.getElementById("table").innerHTML = createInputTable()
	document.getElementById("ready").hidden = true
	document.getElementById("finish").hidden = false
}
var finish = function () {
	//document.getElementById("timer").hidden = true
	document.getElementById("solve_time").innerHTML = msToTime(getTime()-memoTime)	
	var fields = document.getElementsByName("memo_input")
	var input = copyOfMemo()
	var i = 0
	for (var j in memos) {
		for (var k in memos[j]) {
			input[j][k] = onlyLetters(fields[i++].value)
		}
	}
	document.getElementById("table").innerHTML = createTable(checkMemo(input))
	document.getElementById("finish").hidden = true
	document.getElementById("start").hidden = false
	finished = 1
}
var reset = function () {
	memos = []
	date = new Date()
	document.getElementById("time_table").hidden = true
}
