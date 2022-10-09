let fs = require('fs');
const path = './welcome.txt';
let data;
let codes = {};

//read file
try {
	data = fs.readFileSync(path, 'utf8');
	main();
} catch (err) {
	console.error(err);
}
//main function
function main() {
	let freqs = frequency(data);
	let arr = sortFreq(freqs);
	let tree = buildTree(arr);
	let node = trimTree(tree);
	assignCodes(node);
	let output = encode(data); // pass the original string
	let mainout = decode(node, output); // pass trimtree(tree) , string
	console.log('Encoded data : ', output);
	console.log('Decoded data : ', mainout);
}

function frequency(str) {
	let freqs = {};
	for (let i = 0; i < str.length; i++) {
		if (str[i] in freqs) {
			freqs[str[i]]++;
		} else {
			freqs[str[i]] = 1;
		}
	}
	return freqs;
}

function sortFreq(freqs) {
	let letters = [];
	for (let ch in freqs) {
		letters.push([freqs[ch], ch]);
	}
	return letters.sort();
}

function buildTree(letters) {
	while (letters.length > 1) {
		let leastTwo = letters.slice(0, 2);
		let theRest = letters.slice(2, letters.length);
		let combFreq = letters[0][0] + letters[1][0];
		letters = theRest;
		let two = [combFreq, leastTwo];
		letters.push(two);
		letters.sort();
	}
	return letters[0];
}
function trimTree(tree) {
	let p = tree[1];
	if (typeof p === 'string') {
		return p;
	} else {
		return Array(trimTree(p[0]), trimTree(p[1]));
	}
}

function assignCodes(node, pat) {
	pat = pat || '';
	if (typeof node == typeof '') {
		codes[node] = pat;
	} else {
		assignCodes(node[0], pat + '0');
		assignCodes(node[1], pat + '1');
	}
	return codes;
}

function encode(str) {
	let output = '';
	for (let i = 0; i < str.length; i++) {
		output = output + codes[str[i]];
	}
	return output;
}
function decode(tree, str) {
	let output = '';
	let p = tree;
	for (let i = 0; i < str.length; i++) {
		if (str[i] == '0') {
			p = p[0];
		} else {
			p = p[1];
		}
		if (typeof p === 'string') {
			output = output + p;
			p = tree;
		}
	}
	return output;
}
