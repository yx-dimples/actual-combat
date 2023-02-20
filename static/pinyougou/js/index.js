// 网页轮廓图
window.addEventListener('load', function () {
    // 先执行全局变量，在执行局部变量
    var arrow_1 = document.querySelector('.left').querySelector('a')
    var arrow_2 = document.querySelector('.right').querySelector('a')
    var focus = document.querySelector('.focus')
    var focuswidth = focus.offsetWidth;
    var ul = focus.querySelector('ul')
    var circle = focus.querySelector('.circle')
    var num = 0;
    var dian = 0;
    focus.addEventListener('mouseenter', function () {
        arrow_1.style.display = 'block'
        arrow_2.style.display = 'block'
    })
    focus.addEventListener('mouseleave', function () {
        arrow_1.style.display = 'none'
        arrow_2.style.display = 'none'
    })
    // for里面的变量和值也属于全局变量
    for (var i = 0; i < ul.children.length; i++) {
        // 创建li,并添加
        var li = document.createElement('li')
        // 通过自定义属性记录小圆圈的索引号
        li.setAttribute('date-index', i)
        circle.appendChild(li);
        // 排他思想
        li.addEventListener('click', function () {
            for (var i = 0; i < circle.children.length; i++) {
                circle.children[i].className = ''
            }
            this.className = 'current'
            // 点击小圆圈，移动图片，移动ul
            var index = this.getAttribute('date-index')
            // 每次点击某个li，就把索引号给他们
            num = index;
            dian = index;
            animate(ul, -index * focuswidth)
        })
    }
    circle.children[0].className = 'current';
    // 克隆第一张图片放ul最后面，实现无缝滚动,用克隆而不外加li是因为避免出现多的小圆圈
    var first = ul.children[0].cloneNode(true)
    ul.appendChild(first)
    // 点击右侧按钮，图片滚动一张
    // 右箭头
    arrow_2.addEventListener('click', function () {
        // 如果到了最后一张，ul要 快速复原left改为0
        if (num == ul.children.length - 1) {
            ul.style.left = 0;
            num = 0;
        }
        num++;
        animate(ul, -num * focuswidth)
        dian++;
        if (dian == circle.children.length) {
            dian = 0
        }
        for (var i = 0; i < circle.children.length; i++) {
            circle.children[i].className = ''
        }
        circle.children[dian].className = 'current'
    })
    // 左箭头
    arrow_1.addEventListener('click', function () {
        // 如果到了第一张，ul要 快速复原left改为最大
        if (num == 0) {
            num = ul.children.length - 1
            ul.style.left = -num * focuswidth + 'px';
        }
        num--;
        animate(ul, -num * focuswidth)
        dian--;
        if (dian < 0) {
            dian = circle.children.length - 1;
        }
        for (var i = 0; i < circle.children.length; i++) {
            circle.children[i].className = ''
        }
        circle.children[dian].className = 'current'
    })
    // 自动播放轮廓图
    var timer = setInterval(function () {
        arrow_2.click();//手动点击事件
    }, 5000);
})