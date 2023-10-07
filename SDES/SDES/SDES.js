var DES = {
    text: [],//明文
    stext: [],//密文
    key: [],
    key0: [],//记录初始密钥
    P10Box: [3, 5, 2, 7, 4, 10, 1, 9, 8, 6],
    P8Box: [6, 3, 7, 4, 8, 5, 10, 9],
    LeftShift1Box: [2, 3, 4, 5, 1],
    LeftShift2Box: [3, 4, 5, 1, 2],
    IP1Box: [2, 6, 3, 1, 4, 8, 5, 7],
    IP2Box: [4, 1, 3, 5, 7, 2, 8, 6],
    EPbox: [4, 1, 2, 3, 2, 3, 4, 1],
    SPBox: [2, 4, 3, 1],
    SBox1: [[1, 0, 3, 2], [3, 2, 1, 0], [0, 2, 1, 3], [3, 1, 0, 2]],
    SBox2: [[0, 1, 2, 3], [2, 3, 1, 0], [3, 0, 1, 2], [2, 1, 0, 3]],
    //密钥置换
    P10: function (arr) {
        let temp = [];
        temp = arr.concat();
        for (let i = 0; i < arr.length; i++) {
            temp[i] = arr[this.P10Box[i] - 1];
        }
        this.key = temp.concat();
    },
    P8: function (arr) {
        let temp = [];
        temp = arr.slice(2);
        for (let i = 0; i < arr.length; i++) {
            temp[i] = arr[this.P8Box[i] - 1];
        }
        this.key = temp.slice(0, 8);
    },
    LeftShift1: function (arr) {
        let temp = [];
        temp = arr.concat();
        for (let i = 0; i < arr.length; i++) {
            temp[i] = arr[this.LeftShift1Box[i] - 1];
        }
        return temp;
    },
    LeftShift2: function (arr) {
        let temp = [];
        temp = arr.concat();
        for (let i = 0; i < arr.length; i++) {
            temp[i] = arr[this.LeftShift2Box[i] - 1];
        }
        return temp;
    },
    //f函数
    Ffuc: function (R, k) {
        let temp = [], left = [], right = [];
        for (let i = 0; i < 8; i++) {
            temp[i] = R[this.EPbox[i] - 1] ^ k[i];
        }
        left = temp.slice(0, 4);
        right = temp.slice(4);
        let leftrow = left[0] * 2 + left[3];
        let leftcol = left[1] * 2 + left[2];
        let rightrow = right[0] * 2 + right[3];
        let rightcol = right[1] * 2 + right[2];
        left[3] = (this.SBox1[leftrow][leftcol] / 2);//0
        left[0] = this.SBox1[leftrow][leftcol] % 2;//1
        left[2] = this.SBox2[rightrow][rightcol] / 2;//2
        left[1] = this.SBox2[rightrow][rightcol] % 2;//3
        return left.slice(0, 4);
    },
    //初始置换
    IP1: function (arr) {
        let temp = [];
        temp = arr.concat();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = temp[this.IP1Box[i] - 1];
        }
    },
    IP2: function (arr) {
        let temp = [];
        temp = arr.concat();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = temp[this.IP2Box[i] - 1];
        }
    }
}
function XOR(a, b) {
    let c = [];
    for (let i = 0; i < a.length; i++)
        c[i] = a[i] ^ b[i];
    return c;
}
function keymake1(arr) {
    DES.P10(arr);
    let key1 = DES.LeftShift1(DES.key.slice(0, 5));
    let key2 = DES.LeftShift1(DES.key.slice(5));
    DES.P8(key1.concat(key2));
}
function keymake2(arr) {
    DES.P10(arr);
    let key1 = DES.LeftShift2(DES.key.slice(0, 5));
    let key2 = DES.LeftShift2(DES.key.slice(5));
    DES.P8(key1.concat(key2));
}
function SDES() {
    DES.IP1(DES.text);
    let L = DES.text.slice(0, 4);
    let R = DES.text.slice(4);
    let mykey = DES.key;
    keymake1(mykey);
    let f = DES.Ffuc(R, DES.key)
    L = XOR(L, f);
    let temp = []; temp = L; L = R; R = temp;
    keymake2(mykey);
    f = DES.Ffuc(R, DES.key)
    L = XOR(L, f);
    DES.stext = L.concat(R);
    DES.IP2(DES.stext);
}
//解密函数
function SDES2() {
    DES.IP1(DES.stext);
    let L = DES.stext.slice(0, 4);
    let R = DES.stext.slice(4);
    let mykey = DES.key;
    keymake2(mykey);
    let f = DES.Ffuc(R, DES.key)
    L = XOR(L, f);
    let temp = []; temp = L; L = R; R = temp;
    keymake1(mykey);
    f = DES.Ffuc(R, DES.key)
    L = XOR(L, f);
    DES.text = L.concat(R);
    DES.IP2(DES.text);
}
//先定义一个空数组装准备输入的数据
//连接、定义输入框，提交按钮和显示框
var dPut = document.getElementById("put");
var dBtn = document.getElementById("btn");
var dInt = document.getElementById("int");

//点击按钮实现功能
dBtn.onclick = function array() {
    let tt = dPut.value;
    if (tt.length == 8 && DES.key.length == 10) {
        for (let n of tt) {
            DES.text.push(n);
        }
        SDES();
        let s = "密文为： ";
        for (let i of DES.text)
            s += i;
        dInt.value = s;
        DES.text = [];
        DES.stext = [];
        DES.key = DES.key0.concat();//恢复密钥
    }
    else
        alert("请输入10bit密钥和8bit明文")
}
//输入密钥
var dPut2 = document.getElementById("put2");
var dBtn2 = document.getElementById("btn2");
dBtn2.onclick = function array() {
    DES.key = [];
    let tt = dPut2.value;
    if (tt.length == 10) {
        for (let n of tt) {
            DES.key.push(n);
        }
        DES.key0 = DES.key.concat();
    }
    else
        alert("请输入10bit密钥")
}
//解密
var dPut3 = document.getElementById("put3");
var dBtn3 = document.getElementById("btn3");
dBtn3.onclick = function array() {
    let tt = dPut3.value;
    if (tt.length == 8 && DES.key.length == 10) {
        for (let n of tt) {
            DES.stext.push(n);
        }
        //解密函数,解密后明文为DES.text
        SDES2();
        dInt.value = "";
        //输出明文
        let s = "明文为： ";
        for (let i of DES.text)
            s += i;
        dInt.value = s;
        DES.text = [];
        DES.stext = [];
        DES.key = DES.key0.concat();//恢复密钥
    }
    else
        alert("请输入10bit密钥和8bit密文")
}