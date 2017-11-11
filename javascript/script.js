var memos = []
var date = new Date()
var memoTime = 0
var finished = 0

// free start button
var initialized = function() {
	document.getElementById("start").value = "Start"
	document.getElementById("start").disabled = false
}

// generate a random cube state
var generateScramble = function() {
	const cube = Cube.random()
	return getLetters(cube.toJSON())
}

var edges = "BMCIDEAQVOUKXGWSJPLFRHTN"
var corners = "CMJDIFAERBQNVKPUGLXSHWOT"

var onlyLetters = function (str) {
	var newStr = ""
		for (var i in str) {
			if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 65+23) newStr += str[i]
		}
	return newStr
}

// generate memo given a random state
var getLetters = function(state) {
	var cM = "", eM = ""
	var cB = 3*2, eB = 2*5
	var eT = 0
	var eV = new Array(12).fill(0);
	var cur = Math.floor(eB/2)
		var eO = eB%2
		var t = 0
		while (eT != 12) {
			while(true) {
				eO += state.eo[cur]
					cur = state.ep[cur]
					if (eV[cur] == 0) {
						eV[cur] = 1
							eT++
					} else break
					if (cur != Math.floor(eB/2)) eM += edges[2*cur+eO%2]
			}
			for (var i in eV) {
				if (eV[i] == 0 && state.ep[i] == i && state.eo[i] == 0) {
					eT++
						eV[i] = 1
				}
				if (eV[i] == 0) {
					eO = 0
						cur = i
						eM += edges[2*cur+eO%2]
						break
				}
			}
		}
	var cT = 0
		var cV = new Array(8).fill(0);
	cur = Math.floor(cB/3)
		var cO = cB%3
		while (cT != 8) {
			while(true) {
				cO += 3-state.co[cur]%3
					cur = state.cp[cur]
					if (cV[cur] == 0) {
						cV[cur] = 1
							cT++
					} else break
						if (cur != Math.floor(cB/3)) cM += corners[3*cur+(cO)%3]
			}
			for (var i in cV) {
				if (cV[i] == 0 && state.cp[i] == i && state.co[i] == 0) {
					cT++
						cV[i] = 1
				}
				if (cV[i] == 0) {
					cO = 0
						cur = i
						cM += corners[3*cur+(cO)%3]
						break
				}
			}
		}
	return [cM, eM]
}

// disable start button for loading
var init = function() {
	document.getElementById("start").value = "Loading..."
	document.getElementById("start").disabled = true
	document.getElementById("start").style.color = "black"
}

Cube.asyncInit('https://linux.ime.usp.br/~pedrosousa/MBLD-Trainer/node_modules/cubejs/lib/worker.js', initialized);

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
	var temp = generateScramble()
	console.log(temp)
	return temp
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
		console.log("oi")
		for (var i = 0; i<size; i++) {
			memos.push(generateMemo())
		}
	startTimer()

		document.getElementById("table").innerHTML = createTable()
		document.getElementById("time_table").hidden = false
		document.getElementById("table").hidden = false
		//document.getElementById("timer").hidden = false
		document.getElementById("start").hidden = true
		document.getElementById("ready").hidden = false
	document.getElementById("timer").hidden = false
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
var resetButton = function() {
	document.getElementById("finish").hidden = true
	document.getElementById("ready").hidden = true
	document.getElementById("start").hidden = false
	document.getElementById("table").hidden = true
	document.getElementById("time_table").hidden = true
	document.getElementById("timer").hidden = true
}
var reset = function () {
	memos = []
		date = new Date()
		document.getElementById("time_table").hidden = true
}
