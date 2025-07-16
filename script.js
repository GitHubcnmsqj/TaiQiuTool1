document.addEventListener('DOMContentLoaded', function() {
    const numberElements = document.querySelectorAll('.number');
    const nextBtn = document.getElementById('nextBtn');
    const countElement = document.getElementById('count');
    let count = 1;
    let previousNumbers = [];
    let positionHistory = [[], [], []]; // 记录每个位置的数字历史

    // 检查数字在特定位置是否已出现3次
    function isPositionOverLimit(num, position) {
        return positionHistory[position].filter(n => n === num).length >= 2;
    }

    // 检查新旧数字相似度
    function isTooSimilar(newNumbers, oldNumbers) {
        if (!oldNumbers.length) return false;
        let sameCount = 0;
        newNumbers.forEach(num => {
            if (oldNumbers.includes(num)) sameCount++;
        });
        return sameCount > 2;
    }

    // 生成三个不重复的随机数字(1-9)
    function generateRandomNumbers() {
        let numbers = [];
        let attempts = 0;
        const maxAttempts = 50; // 防止无限循环
        
        while (numbers.length < 3 && attempts < maxAttempts) {
            attempts++;
            const num = Math.floor(Math.random() * 9) + 1;
            const position = numbers.length;
            
            if (!numbers.includes(num) && 
                !isPositionOverLimit(num, position)) {
                numbers.push(num);
            }
        }
        
        // 如果尝试次数过多，放宽限制
        if (attempts >= maxAttempts) {
            numbers = [];
            while (numbers.length < 3) {
                const num = Math.floor(Math.random() * 9) + 1;
                if (!numbers.includes(num)) {
                    numbers.push(num);
                }
            }
        }
        
        // 避免连续出现相同的结果或过于相似
        if ((previousNumbers.length > 0 && 
             JSON.stringify(numbers) === JSON.stringify(previousNumbers)) ||
            isTooSimilar(numbers, previousNumbers)) {
            return generateRandomNumbers();
        }
        
        // 更新历史记录
        numbers.forEach((num, index) => {
            positionHistory[index].push(num);
        });
        
        previousNumbers = [...numbers];
        return numbers.sort((a, b) => a - b);
    }

    // 更新显示的数字
    function updateNumbers() {
        const numbers = generateRandomNumbers();
        numberElements.forEach((el, index) => {
            el.textContent = numbers[index];
        });
        countElement.textContent = count++;
    }

    // 初始化显示
    updateNumbers();

    // 按钮点击事件
    nextBtn.addEventListener('click', updateNumbers);
});