describe('placeRandomNumbers', function() {
    beforeAll(function() {
        $('.num').text('');
        placeRandomNumbers();
    });
    afterAll(function() {
        $('.num').text('');
    });
    it('should put an integer that is larger than 0 and smaller than 21 in each cell.', function() {
        var nums = $('.num');
        var len = nums.length;
        for (var i = 0; i < len; i++) {
            expect(parseInt(nums.eq(i).text()) > 0).toBe(true);
            expect(parseInt(nums.eq(i).text()) < 21).toBe(true);
        }
    });
});

describe('initGame', function() {
    beforeEach(function() {
        jasmine.clock().install();
    });
    afterEach(function() {
        jasmine.clock().uninstall();
    });
    it('should reset all game state tracking variables.', function() {
        callPendingNumber = 3;
        targetSum = 20;
        clickLock = true;
        nFlips = 7;
        nCovered = 0;
        $('.flip-container').addClass('opened');
        $('.flip-container').addClass('used');
        initGame();
        expect($('.flip-container.opened').length).toBe(0);
        expect($('.flip-container.used').length).toBe(0);
        jasmine.clock().tick(1201);
        expect(nFlips).toBe(0);
        expect(clickLock).toBe(false);
        expect(nCovered).toBe($('.num').length);
        expect(targetSum === null).toBe(true);
        expect(callPendingNumber === null).toBe(true);
    });
    it('should call placeRandomNumbers to arrange the numbers.', function() {
        spyOn(window, 'placeRandomNumbers');
        expect(placeRandomNumbers).not.toHaveBeenCalled();
        initGame();
        jasmine.clock().tick(1201);
        expect(placeRandomNumbers).toHaveBeenCalled();
    });
});

describe('flip container click handler', function() {
    var ncells = $('.flip-container').length;
    beforeEach(function() {
        jasmine.clock().install();
        initGame();
        jasmine.clock().tick(1201);
    });
    afterEach(function() {
        jasmine.clock().uninstall();
    });
    it('should record the number that is waiting for the next flip.', function() {
        var idx = Math.floor(Math.random() * ncells);
        var num = $('.num').eq(idx);
        var nn = parseInt(num.text());
        num.click();
        expect(callPendingNumber).toBe(nn);
    });
    it('should set the target number if necessary.', function() {
        var idx = Math.floor(Math.random() * ncells);
        var f = $('.flip-container').eq(idx);
        var nn = parseInt(f.find('.num').text());
        f.click();
        expect(targetSum !== null && targetSum > callPendingNumber).toBe(true);
    });
    it('should mark the matching pair used.', function() {
        var idx = Math.floor(Math.random() * ncells);
        var f = $('.flip-container').eq(idx);
        var nn = parseInt(f.find('.num').text());
        f.click();
        // change the target number manually
        var tmp = $('.flip-container').not('.opened').eq(0);
        targetSum = parseInt(tmp.find('.num').text()) + callPendingNumber;
        tmp.click();
        expect(targetSum === null).toBe(true);
        expect(callPendingNumber === null).toBe(true);
        expect($('.opened').length).toBe(0);
        expect($('.used').length).toBe(2);
    });
    it('should increase the number of clicks for every valid click.', function() {
        var oldNFlips = nFlips;
        $('.flip-container').eq(3).click();
        expect(nFlips - oldNFlips).toBe(1);
    });
    it('should not increase the number of clicks for invalid clicks.', function() {
        var num3 = $('.flip-container').eq(3);
        num3.click();
        var oldNFlips = nFlips;
        num3.click();
        expect(nFlips - oldNFlips).toBe(0);
        clickLock = true;
        $('.flip-container').eq(0).click();
        expect(nFlips - oldNFlips).toBe(0);
        clickLock = false;
        $('.flip-container').eq(0).click();
        expect(nFlips - oldNFlips).toBe(1);
    });
    it('should flip the cards back, reset the number keepers if the sum does not match the target.', function() {
        var idx = Math.floor(Math.random() * ncells);
        var f = $('.flip-container').eq(idx);
        var nn = parseInt(f.find('.num').text());
        f.click();
        // change the target number manually
        targetSum = 200;

        $('.flip-container').not('.opened').eq(0).click();
        jasmine.clock().tick(1001);
        expect(targetSum === null).toBe(true);
        expect(callPendingNumber === null).toBe(true);
        expect($('.opened').length).toBe(0);
    });
});

describe('window click handler', function() {
    beforeEach(function() {
        spyOn(window, 'initGame');
    });
    afterAll(function() {
        initGame();
    });
    it('should initialize the game if nCovered is 0.', function() {
        nCovered = 0;
        expect(initGame).not.toHaveBeenCalled();
        $(window).click();
        expect(initGame).toHaveBeenCalled();
    });
    it('should not initialize the game if nCovered is not 0.', function() {
        nCovered = 4;
        expect(initGame).not.toHaveBeenCalled();
        $(window).click();
        expect(initGame).not.toHaveBeenCalled();
    });
});
