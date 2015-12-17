"use strict";

var nums = $('.num');
var placeRandomNumbers = function() {
    var cands = [];
    for (var i = 1; i < 21; i++) {
        cands.push(i);
    }
    for (var i = 0, len = nums.length; i < len; i++) {
        var n = Math.floor(Math.random() * cands.length);
        nums.eq(i).text(cands.splice(n, 1)[0]);
    }
};

var nFlipSpan = $('#nflips');
var nFlips = 0;
var targetN = $('#targetn');
var targetSum = null;

var nCovered = nums.length;
var callPendingNumber = null;
var clickLock = true;

var initGame = function() {
    $('.opened').removeClass('opened');
    $('.used').removeClass('used');
    setTimeout(function() {
        nFlips = 0;
        nFlipSpan.text(nFlips);
        callPendingNumber = null;
        targetSum = null;
        targetN.text('');
        clickLock = false;
        nCovered = nums.length;
        placeRandomNumbers();
    }, 1200);
};


$('.flip-container').on('click', function(e) {
    var $this = $(this);
    if (nCovered > 0 && !clickLock && !$this.hasClass('opened')) {
        clickLock = true;
        e.stopPropagation();
        nFlipSpan.text(++nFlips);

        if (callPendingNumber === null) {

            callPendingNumber = parseInt($this.addClass('opened').find('.num').text());
            var m = $('.flip-container').not('.opened').not('.used');
            targetSum = parseInt(m.eq(Math.floor(Math.random() * m.length)).text()) + callPendingNumber;
            targetN.text(targetSum);
            clickLock = false;

        } else {

            var n = parseInt($this.addClass('opened').find('.num').text());
            if (n === targetSum - callPendingNumber) {
                $('.opened').removeClass('opened').addClass('used');
                nCovered -= 2;
                callPendingNumber = null;
                targetSum = null;
                targetN.text('');
                if (nCovered === 0)
                    return;
                clickLock = false;

            } else {
                setTimeout(function() {
                    $('.opened').removeClass('opened');
                    callPendingNumber = null;
                    targetSum = null;
                    targetN.text('');
                    clickLock = false;
                }, 1000);
            }

        }
    }
});


$(window).click(function() {
    if (nCovered === 0) {
        initGame();
    }
});

initGame();
