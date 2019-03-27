var goWork = (function() {
  var _ref = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee(
      time1,
      timeStartWork
    ) {
      var time2, time3, time4, arrivalTime;
      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.next = 2;
                return wakeUp(time1);
              case 2:
                time2 = _context.sent;
                _context.next = 5;
                return takeSubway(time2);
              
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function goWork(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();