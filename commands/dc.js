module.exports = function (from, to, param, client) {
	if('DARTHCLAUDIO' === from) { 
		return '<+brunogallotti> onde tu escondes o sabre enorme e grosso quando some em tuas costas, ò DARTHCLAUDIO ???'; 
	}
	
	if(param) {
		param = param.trim().toUpperCase();
	}
	
	return 'O ' + (param || 'BRASIL') + ' TRIUNFA!';
};
