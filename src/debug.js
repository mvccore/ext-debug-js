(function (_toByteArray, _base64DecodeFromByteArray, _lastDump, _dumpsCount) {
	
	/***************************************************************************
	 *                                                                         *
	 *            This file is designed to take the least amount               *
	 *            of space after compiling with Google Closure.                *
	 *                                                                         *
	 **************************************************************************/
	 
    var oldIe = /MSIE [5-8]/g.test(navigator.userAgent),
    	_getElementById = 'getElementById',
    	_style = 'style',
    	_height = 'height',
    	_width = 'width',
    	_block = 'block',
    	_auto = 'auto',
		_display = 'display',
		_opacity = 'opacity',
    	_px = 'px',
		_buttonHeight = 20,
    	_doc = document,
    	_win = window,
    	_container = _doc[_getElementById]('mvccore-dumps'),
    	_dumpItems = _doc[_getElementById]('mvccore-dumps-items'),
    	_button = _doc[_getElementById]('mvccore-dumps-btn'),
    	_addEventListener = oldIe ? 'attachEvent' : 'addEventListener',
    	_containerStyle = _container[_style],
    	_dumpItemsStyle = _dumpItems[_style],
    	_opened = !1,
    	_localStorage = localStorage || {},
		_mvccoreDumpsVisible = 'mvccoreDumpsVisible',
		_length = 'length',
		_prototype = 'prototype',
		_open = 'open',
		_innerHTML = 'innerHTML',
		_mvccoreAjaxHeader = 'x-mvccore-debug',
		_contentEncodingHeader = 'content-encoding';
	
    function _resizeHandler () {
		if (_opened) {
			_containerStyle[_height] = _auto;
			_containerStyle[_width] = _auto;
    		var _containerHeight = _container.offsetHeight,
    			_containerWidth = _container.offsetWidth,
				_winHeightWithoutBtn = _win.innerHeight - _buttonHeight,
            	_winWidthWithoutBtn = _win.innerWidth - _buttonHeight;
			_containerStyle.overflow = (
				_winHeightWithoutBtn > _containerHeight &&
				_winWidthWithoutBtn < _containerWidth
			)
				? 'hidden'
				: _auto;
            _containerStyle[_height] = Math.min(_winHeightWithoutBtn, _containerHeight) + _px;
            _containerStyle[_width] = Math.min(_winWidthWithoutBtn, _containerWidth) + _px
        }
    }
    function _clickHandler (_lastDumpOrEvent) {
		if (typeof (_lastDumpOrEvent) != 'boolean') 
            _opened = !_opened;
		_localStorage[_mvccoreDumpsVisible] = _opened;
		_opened
			? _dumpItemsStyle[_display] = _block
			: (
				_dumpItemsStyle[_display] = 'none',
				_containerStyle[_height] = _auto,
				_containerStyle[_width] = _auto
			);
        _resizeHandler()
	}
	function _ajaxLoaded (_xhr) {
		var _countAndDumps = _ajaxLoadedGetCountDumpsAndEncoding(_xhr),
			_dumpsCountLocal	= _countAndDumps[0],
			_dumps				= _countAndDumps[1],
			_encoding			= _countAndDumps[2],
			_newDumpsStr		= '';
		for (var _i = 0; _i < _dumpsCountLocal; _i += 1) 
			_newDumpsStr += _base64Decode(_dumps[_i], _encoding);
		_dumpItems[_innerHTML] = _dumpItems[_innerHTML] + _newDumpsStr;
		_dumpsCount += _dumpsCountLocal;
		_setUpButton(_lastDump, _dumpsCount);
	}
	function _ajaxLoadedGetCountDumpsAndEncoding (_xhr) {
		var _headers = _xhr.getAllResponseHeaders().split('\n'),
			_header = '',		_name = '',			_value = '',
			_encoding = '',		_pos = 0,			_count = 0,
			_indexesStr = '',	_firstIndex = 0,	_secondIndex = 0,
			_indexesArr = [],	_rawDumps = [],		_dumps = [];
		for (var _i = 0, _l = _headers[_length]; _i < _l; _i += 1) {
			_header = _headers[_i];
			_pos = _header.indexOf(':');
			if (_pos > -1) {
				_name = _header.substr(0, _pos);
				if (_name == _contentEncodingHeader) {
					_encoding = _header.substr(_pos + 1).trim().toLowerCase();
				} else if (_name == _mvccoreAjaxHeader) {
					_count = parseInt(_header.substr(_pos + 1).trim(), 10);
				} else if (_name.indexOf(_mvccoreAjaxHeader) === 0) {
					_indexesStr = _header.substring(_mvccoreAjaxHeader[_length] + 1, _pos).trim();
					_indexesArr = _indexesStr.split('-');
					_firstIndex = parseInt(_indexesArr[0], 10);
					_secondIndex = parseInt(_indexesArr[1], 10);
					if (typeof _rawDumps[_firstIndex] == 'undefined')
						_rawDumps[_firstIndex] = [];
					_rawDumps[_firstIndex][_secondIndex] = _header.substr(_pos + 1).trim();
				}
			}
		}
		for (_i = 0, _l = _rawDumps[_length]; _i < _l; _i += 1) 
			_dumps[_i] = _rawDumps[_i].join('')
		return [_count, _dumps, _encoding];
	}
	function _base64Decode(_base64str, _encoding) {
		return new _base64DecodeFromByteArray(_encoding)(_toByteArray(_base64str))
	}
	function _setUpButton  (_lastDumpLocal, _dumpsCountLocal) {
		if (_lastDumpLocal) _opened = !0;
		if (_dumpsCountLocal) {
			_button.value = 'Dumps(' + _dumpsCountLocal + ')';
			_containerStyle[_opacity] = 1
		}
		_clickHandler(_lastDumpLocal);
	}
	function _setUpAjax () {
		if (oldIe) return; // no AJAX debuging messages in old browsers:-()
		var _globalXhr = _win.XMLHttpRequest,
			_builtInOpen = _globalXhr[_prototype][_open];
		_globalXhr[_prototype][_open] = function () {
			var _scope = this;
			_builtInOpen.apply(_scope, arguments);
			_scope[_addEventListener]((oldIe?'on':'')+'load', function () {
				_ajaxLoaded(_scope)
			});
		};
	}
	function _init() {
		_opened = _localStorage
			? _localStorage[_mvccoreDumpsVisible] === 'true'
			: _opened;
		_containerStyle[_display] = _block;
		_win[_addEventListener]('resize', _resizeHandler);
		_button[_addEventListener]('click', _clickHandler);
		_setUpButton(_lastDump, _dumpsCount);
		_setUpAjax();
	}
	
	_init();
	
})(
	// https://github.com/beatgammit/base64-js
	(function () {
		var t = [],
			o = [],
			a = typeof Uint8Array !== "undefined" ? Uint8Array : Array
			f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for (var i = 0, u = f.length; i < u; ++i) {
			t[i] = f[i];
			o[f.charCodeAt(i)] = i
		}
		o["-".charCodeAt(0)] = 62;
		o["_".charCodeAt(0)] = 63;
		function v(r) {
			var e = r.length;
			if (e % 4 > 0)
				throw new Error("Invalid string. Length must be a multiple of 4");
			var n = r.indexOf("=");
			if (n === -1) n = e;
			var t = n === e ? 0 : 4 - n % 4;
			return [n, t]
		}
		function c(r, e, n) {
			return (e + n) * 3 / 4 - n
		}
		function h(r) {
			var e,
				n = v(r),
				t = n[0],
				f = n[1],
				i = new a(c(r, t, f)),
				u = 0,
				d = f > 0 ? t - 4 : t;
			for (var h = 0; h < d; h += 4) {
				e = o[r.charCodeAt(h)] << 18 | o[r.charCodeAt(h + 1)] << 12 | o[r.charCodeAt(h + 2)] << 6 | o[r.charCodeAt(h + 3)];
				i[u++] = e >> 16 & 255;
				i[u++] = e >> 8 & 255;
				i[u++] = e & 255
			}
			if (f === 2) {
				e = o[r.charCodeAt(h)] << 2 | o[r.charCodeAt(h + 1)] >> 4;
				i[u++] = e & 255
			}
			if (f === 1) {
				e = o[r.charCodeAt(h)] << 10 | o[r.charCodeAt(h + 1)] << 4 | o[r.charCodeAt(h + 2)] >> 2;
				i[u++] = e >> 8 & 255;
				i[u++] = e & 255
			}
			return i
		}
		return h;
	})(),
	// https://github.com/coolaj86/TextEncoderLite
	function () {
		function utf8ToBytes(a, b) {
			b = b || Infinity;
			for (var c, d = a.length, e = null, f = [], g = 0; g < d; g++) {
				if (c = a.charCodeAt(g), !(55295 < c && 57344 > c)) e && (-1 < (b -= 3) && f.push(239, 191, 189), e = null);
				else if (e) {
					if (56320 > c) {
						-1 < (b -= 3) && f.push(239, 191, 189), e = c;
						continue
					} else c = 65536 | (e - 55296 << 10 | c - 56320), e = null;
				} else if (56319 < c) {
					-1 < (b -= 3) && f.push(239, 191, 189);
					continue
				} else if (g + 1 === d) {
					-1 < (b -= 3) && f.push(239, 191, 189);
					continue
				} else {
					e = c;
					continue
				}
				if (128 > c) {
					if (0 > (b -= 1)) break;
					f.push(c)
				} else if (2048 > c) {
					if (0 > (b -= 2)) break;
					f.push(192 | c >> 6, 128 | 63 & c)
				} else if (65536 > c) {
					if (0 > (b -= 3)) break;
					f.push(224 | c >> 12, 128 | 63 & c >> 6, 128 | 63 & c)
				} else if (2097152 > c) {
					if (0 > (b -= 4)) break;
					f.push(240 | c >> 18, 128 | 63 & c >> 12, 128 | 63 & c >> 6, 128 | 63 & c)
				} else throw new Error('Invalid code point')
			}
			return f
		}
		function utf8Slice(a, b, c) {
			var d = '',
        		e = '';
			c = Math.min(a.length, c || Infinity), b = b || 0;
			for (var f = b; f < c; f++) 127 >= a[f] ? (d += decodeUtf8Char(e) + String.fromCharCode(a[f]), e = '') : e += '%' + a[f].toString(16);
			return d + decodeUtf8Char(e)
		}
		function decodeUtf8Char(a) {
			try {
				return decodeURIComponent(a)
			} catch (b) {
				return String.fromCharCode(65533)
			}
		}
		var TextEncoderLite = function (a) {
			return utf8Slice(a, 0, a.length)
		}
		return TextEncoderLite;
	},
	'%mvccoreInitArgs%'
);
