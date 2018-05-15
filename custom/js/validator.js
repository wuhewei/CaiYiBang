var RQ = 1;		// 必填

var N = 2;		// 数值
var D = 3;		// 日期
var T = 4;		// 日期时间
var E = 5;		// 邮箱

var RANGE = 6;	// 区间
var EQ = 7;		// 相等
var IN = 8;		// 集合

var INPUT = 1;
var SELECT = 2;

function validate(target, validators, error, type) {
	if (validators != null && validators.length > 0) {
		var $range;
		var $in;
		var $eq;
		for (i in validators) {
			var e = validators[i];
			if (typeof(e) == "string") {
				if (e.indexOf("{") > -1 && e.lastIndexOf("}") > -1) {
					$range = e.substring(1, e.length - 1).split(",");
				} else if (e.indexOf("eq:") > -1) {
					$eq = e.substring(4); 
				} else if (e.indexOf("in [") && e.lastIndexOf("]") > -1) {
					$in = e.substring(4, e.length - 1).split(",");
				}
			}
		}
		
		var t = false;
		var n = false;
		var r = (type != null && type == SELECT ? "选择" : "输入");
		if(error != null) {
			t = true;
		}
		
		var num = false;
		
		for (i in validators) {
			var e = validators[i];
			if (typeof(e) == "number") {
				if (e == RQ && !required(target.value)) {
					return throwable(t, target, "请" + r + error);
				} else if (e == N) {
					num = true;
					if (!number(target.value)) {
						return throwable(t, target, error + "不是合法的整数值");
					}
				} else if (e == RANGE) {
					if (num) {
						if (!size(target.value, $range)) {
							
							return throwable(t, target, error + "的值只能介于" + $range[0] + "到" + $range[1] + "之间");
						}
					} else {
						if (!length(target.value, $range)) {
							return throwable(t, target, error + "的字符长度只能介于" + $range[0] + "到" + $range[1] + "之间");
						}
					}
					
				}
			}
		}
	}
}

function throwable(t, target, error) {
	if (t) {
		if ($(target).attr("type") == "text") {
			target.focus();
		}
		throw error;
	}
	return null;
}

function required(value) {
	if ($.trim(value) == "") {
		return false;
	}
	return true;
}

function number(value) {
	if ($.trim(value) == "") {
		return true;
	}
	if ($.isNumeric(value)) {
		return true;
	}
	return false;
}

function length(value, arr) {
	if ($.trim(value) == "") {
		return true;
	}
	if (value) {
		var min = parseInt(arr[0]);
		var max = parseInt(arr[1]);
		if ($.trim(value).length < min || $.trim(value).length > max) {
			return false;
		}
	}
	return true;
}

function size(value, arr) {
	if ($.trim(value) == "") {
		return true;
	}
	if (value) {
		var min = int(arr[0]);
		var max = int(arr[1]);
		if (int(value) < min || int(value) > max) {
			return false;
		}
	}
	return true;
}