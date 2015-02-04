module.exports = function (from, to, param, client) {
	if(param) {
		param = param.trim().toUpperCase();
	}
	return 'NÃO ASSOCIE ' + (param || 'PEITOS') + ' AO MEU NAMORADO';
};