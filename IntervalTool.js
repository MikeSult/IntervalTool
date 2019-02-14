// intervalTool.js
// three fields:  first note, second note, interval name.  
// enter any two fields and the third is auto-calculated.  
// if both the note fields a set and the interval name is changed
// then the first note is retained and the second note is changed 
// to correct note for the interval name.



var intervalNamesToHalfSteps = {
  'P1': 0, 'dim2': 0, 'aug1': 1, 'mi2': 1, 'ma2': 2, 'dim3': 2, 'aug2': 3, 'mi3': 3, 
  'ma3': 4, 'dim4': 4, 'P4': 5, 'aug3': 5, 'aug4': 6, 'dim5': 6, 'P5': 7, 'dim6': 7, 
  'aug5': 8, 'mi6': 8, 'ma6': 9, 'dim7': 9, 'mi7': 10, 'aug6': 10, 'ma7': 11, 'dim8': 11, 
  'P8': 12, 'aug7': 12
}

var halfStepsToIntervalName = {
    0: ['P1','dim2'],
    1: ['mi2','aug1'],
    2: ['ma2','dim3'],
    3: ['mi3','aug2'],
    4: ['ma3','dim4'],
    5: ['P4','aug3'],
    6: ['aug4','dim5'],
    7: ['P5','dim6'],
    8: ['mi6','aug5'],
    9: ['ma6','dim7'],
    10: ['mi7','aug6'],
    11: ['ma7','dim8'],
    12: ['P8','aug7']
}
var alpha = ['C','D','E','F','G','A','B'];
// var chromatics = ['#','b','x','bb']
// var sharpNames = ['Gx', 'A#', 'B', 'B#', 'C#','Cx', 'D#','E', 'E#',  'F#','Fx','G#'];
// var flatNames =  ['A',  'Bb', 'Cb','C',  'Db','D',  'Eb','Fb', 'F',  'Gb','G', 'Ab'];
// var otherNames = ['Bbb','Cbb','Ax','Dbb','Bx','Ebb','Fbb','Dx','Gbb','Ex','Abb','Ab'];


var noteToNumeric = {
    'A': 0,    'Gx': 0, 'Bbb': 0,
    'A#':1,    'Bb':1,  'Cbb': 1, 
    'B': 2,    'Cb': 2, 'Ax': 2,
    'B#': 3,   'C': 3,  'Dbb': 3,
    'C#': 4,   'Db': 4, 'Bx': 4,
    'Cx': 5,   'D': 5,  'Ebb': 5,
    'D#': 6,   'Eb': 6, 'Fbb': 6,
    'E': 7,    'Fb': 7, 'Dx': 7,
    'E#': 8,   'F': 8,  'Gbb': 8,
    'F#': 9,   'Gb': 9, 'Ex': 9,
    'Fx': 10,  'G': 10, 'Abb': 10,
    'G#': 11,  'Ab': 11
}

var numericToNote = {
    0: ['A', 'Gx', 'Bbb'],
    1: ['A#', 'Bb', 'Cbb'],
    2: ['B', 'Cb', 'Ax'],
    3: ['B#', 'C', 'Dbb'],
    4: ['C#', 'Db', 'Bx'],
    5: ['Cx', 'D', 'Ebb'],
    6: ['D#', 'Eb', 'Fbb'],
    7: ['E', 'Fb', 'Dx'],
    8: ['E#', 'F', 'Gbb'],
    9: ['F#', 'Gb', 'Ex'],
    10: ['Fx', 'G', 'Abb'],
    11: ['G#', 'Ab', 'Ab'],
}

// helper function
function findIndexOfArray(element, array) {
    for(let i=0; i<array.length; i++) {
        if( element.includes(array[i]) )
            return i;
    }
    return -1; // not found
}


// direction param ['up', 'down'] (default 'up')
function calcHalfStepDiff(note1, note2, direction) {
    var theDirection;
    if(direction && direction === 'down') {
        theDirection = 'down';
    } else {
        theDirection = 'up';    
    }
    var num1 = noteToNumeric[note1];
    var num2 = noteToNumeric[note2];
    if(theDirection === 'up' && num1 > num2) {
        num2 += 12;
    } else if(theDirection === 'down' && num1 < num2) {
        num1 += 12;
    }
    return Math.abs(num2-num1);
}

function calcIntervalNumber(note1, note2, direction) {
    var theDirection;
    if(direction && direction === 'down') {
        theDirection = 'down';
    } else {
        theDirection = 'up';    
    }
    var firstLetter = note1[0];
    var secondLetter = note2[0];
    for(let i=0; i<alpha.length; i++) {
       if(firstLetter === alpha[i]) {
           var index1 = i;
       } if(secondLetter === alpha[i]) {
           var index2 = i;
       }
    }
    if(theDirection === 'up' && index1 > index2){
	    index2 += 7;
    } else if(theDirection === 'down' && index1 < index2) {
	    index1 += 7;       
    }
    console.log('index1='+index1+' index2='+index2);
    return Math.abs(index2-index1)+1;
}

function calcSecondIntervalNote(intervalName, note1, direction) {
    var directionSign = (direction && direction === 'down')? -1 : 1;
    var halfSteps = intervalNamesToHalfSteps[intervalName];
    var intervalNum = parseInt(intervalName[intervalName.length-1])-1; // last char is the number, subtracting 1 because 1 means unison (0 difference)
    var note1Numeric = noteToNumeric[note1];
    if(note1Numeric === undefined) {
        alert('Interval Tool says: \nInvalid note1. Use capital letters [A B C D E F G], \nuse # for sharp, use b for flat.');
        return '';    
    } else if(halfSteps  === undefined) {
        alert('Interval Tool says: \nInvalid interval name  Use P, ma, mi, dim, aug as prefixes and interval numbers [1 2 3 4 5 6 7 8]');
        return '';        
    }
    var note2Numeric = (note1Numeric + (halfSteps * directionSign)) % 12; // limit max to numericToNote.length = 12
    if(note2Numeric < 0) note2Numeric += 12;

    var firstLetterIndex = findIndexOfArray(note1, alpha); 
    if(firstLetterIndex < 0) {
        alert('Interval Tool says: \nInvalid note1');
        return '';
    }
    var note2Index = (firstLetterIndex+(intervalNum * directionSign)) % 7;  // alpha.length = 7
    if(note2Index < 0) note2Index += 7;

    var correctLetterNote2 = alpha[note2Index];
//    console.log('correctLetterNote2'+correctLetterNote2+' note2Numeric='+note2Numeric);
    var note2Candidates = numericToNote[note2Numeric];

    var note2 = (note2Candidates[0].includes(correctLetterNote2))? note2Candidates[0]: note2Candidates[1];
    if( note2.includes(correctLetterNote2) != true)
        note2 = note2Candidates[2];

    return note2;
}

function calcIntervalName(note1, note2, direction) {
    var halfSteps = calcHalfStepDiff(note1, note2, direction);
    var intervalNum = calcIntervalNumber(note1, note2, direction);
    if(halfSteps == 11 && intervalNum == 1) {
        intervalNum = 8;
    }
    console.log('halfSteps='+halfSteps+' intervalNum='+intervalNum);
    var intervalNameCandidates = halfStepsToIntervalName[halfSteps];
    var intervalName = intervalNameCandidates[0].includes(intervalNum) ? intervalNameCandidates[0]: intervalNameCandidates[1];
    if(intervalName.includes(intervalNum) !== true) {
        alert('Interval Tool says: \nnote 2 name is too weird to be used with note 1, try renaming note 2 (or rename note 1)');
        return '';
    }
//    console.log('direction='+direction+' halfSteps ='+ halfSteps +' intervalNum='+ intervalNum +
//    ' intervalNameCandidates='+intervalNameCandidates+' intervalNameCandidates[0]'+intervalNameCandidates[0]+ intervalNameCandidates[0].includes(intervalNum)); 
    return intervalName;
}

function calcOctaveNumbers(note1, note2, direction) {
    var octaveNums = [];
    var note1Octave = {
        'A': 4, 'B': 4, 'C': 4, 'D': 4, 
        'E': 4, 'F': 4, 'G': 4
    }
    var note2Octave = {
        'A': 4, 'B': 4, 'C': 4, 'D': 4, 
        'E': 4, 'F': 4, 'G': 4
    }
    var firstLetterIndex = findIndexOfArray(note1, alpha);
    var secondLetterIndex = findIndexOfArray(note2, alpha);
    var note1Oct = note1Octave[note1[0]];
    var note2Oct = note2Octave[note2[0]];
    var indexDiff = secondLetterIndex - firstLetterIndex; 
    console.log('indexDiff='+indexDiff+' note1Oct='+note1Oct+' note2Oct='+note2Oct);
    if(indexDiff < 0) {
        if(direction == 'up') {
            note2Oct +=1;
            console.log('note1Oct='+note1Oct);
        }
    } else {
        if(direction == 'down') {
            if( note1[0].includes('A') || note1[0].includes('A') ) {
                note1Oct +=1;
            } else {
                note2Oct -=1;                
            }
            console.log('note2Oct='+note2Oct);
        } else {
//            note2Oct += 1;
        }
    }
    if(note1Oct == 3 || note2Oct == 3) {
        note1Oct += 1;
        note2Oct += 1;        
    }
    octaveNums.push(note1Oct.toString());
    octaveNums.push(note2Oct.toString());
    return octaveNums;
}

function getDirection() {
    var directionMenu = document.getElementById('direction');
    return directionMenu.options[directionMenu.selectedIndex].value;
}

function updateDisplay() {
    var first_note = document.getElementById('note1').value;
    var second_note =  document.getElementById('note2').value;
    var interval_name =  document.getElementById('intervalName').value;
    if(second_note === '' && interval_name === '') {
        alert('Interval Tool says: Not enough input.  \nYou need to enter note 1 AND either note2 or an interval name');
    } else if( first_note === '' ) {
        alert('Interval Tool says: Not enough input.  \nYou need to enter note 1 AND either note2 or an interval name');
    }
    var direction = getDirection();
    if(second_note === '' && first_note !== '' && interval_name !== '') {
        second_note = calcSecondIntervalNote(interval_name, first_note, direction);
        document.getElementById('note2').value = second_note;
    } else if(interval_name === '' && first_note !== '' && second_note !== '') {
        interval_name = calcIntervalName(first_note, second_note, direction);
        document.getElementById('intervalName').value = interval_name;
    }
    // create notation
    var interval = [];
    var octaveNums = calcOctaveNumbers(first_note, second_note, direction)
    interval.push(first_note + octaveNums[0]);
    interval.push(second_note + octaveNums[1]);
    console.log('interval='+interval);
    Notation.clearCanvas();
    Notation.drawTheStaff(250);
    Notation.drawClef('treble');
    Notation.drawScale(interval);
    document.getElementById('notes').value = interval.toString();
    document.getElementById('playIntervalCode').style.display='inline';
}

function clearNote2() {
    document.getElementById('note2').value = '';
    Notation.clearCanvas();
    document.getElementById('playIntervalCode').style.display='none';
}

function clearIntervalName() {
    document.getElementById('intervalName').value = '';
    Notation.clearCanvas();
    document.getElementById('playIntervalCode').style.display='none';
}

function onchangeDirection() {
    if(document.getElementById('retain_interval_name').checked) {
        document.getElementById('note2').value = '';
    } else {
        document.getElementById('intervalName').value = '';    
    }
    Notation.clearCanvas();
    document.getElementById('playIntervalCode').style.display='none';
}

function clearDisplay() {
    document.getElementById('note1').value = '';
    document.getElementById('note2').value = '';
    document.getElementById('intervalName').value = '';
    Notation.clearCanvas();
    document.getElementById('playIntervalCode').style.display='none';
}


var toneSynth;
var toneInterval;
function playNotes(button) {
    var errorNotes = ['D5','E3'];
    var notesString = document.getElementById('notes').value;
    
    var notes;
    if(notesString) {
        notes = notesString.split(',');
    } else {
        notes = errorNotes;
    }
    
    if(!toneSynth) {
        toneSynth = new Tone.Synth().toMaster();
    }
    toneInterval = new Tone.Sequence(function(time, note){
        toneSynth.triggerAttackRelease(note, 1);
    }, notes, "2n");

    //begin at the beginning
    toneInterval.loop = false;
    toneInterval.start(0);    
    Tone.Transport.start("+0.1");

	var myLoopBoolean = false;
	// ------ add this to all projects that use Rhythm module --------
	autoStop(myLoopBoolean);
}
    
var timeOutRef;
function autoStop(myLoopBoolean) {
	var stopTimeMs = 2000;
	if(!myLoopBoolean) {
		timeOutRef = window.setTimeout(stopIt, (stopTimeMs+1000));
	}
}

function stopIt(){
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    if(toneSynth) {
        toneSynth.dispose();
        toneSynth = null;
    }
    if(toneInterval) {
        toneInterval.dispose();
        toneInterval = null;
    }
}




// button click handler
var button = document.getElementById('calcInterval');
button.onclick = updateDisplay;
var button2 = document.getElementById('clear');
button2.onclick = clearDisplay;
document.getElementById('intervalName').onchange = clearNote2;
document.getElementById('note2').onchange = clearIntervalName;
document.getElementById('direction').onchange = onchangeDirection;
document.getElementById('playIntervalCode').style.display='none';

