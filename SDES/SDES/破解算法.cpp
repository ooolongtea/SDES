#include<bits/stdc++.h>
#include <stdio.h>
#include <string.h>
#include<iostream>
using namespace std;

#define FFI(a, b) for(int i = a; i < b; i++)
#define FFJ(a, b) for(int j = a; j < b; j++)
#define FFK(a, b) for(int k = a; k < b; k++)
#define RR(a, b) for(int i = a; i > b; i++)
#define ME(a, b) memset(a, b, sizeof(a))
#define SC(x) scanf("%d", &x)
#define SCC(a, b) scanf("%d%d", &a, &b)
#define SCCC(a, b, c) scanf("%d%d%d", &a, &b, &c)
#define PR(x) printf("%d\n", x)
#define PRR(a, b) printf("%d%d\n", a, b);
#define INF 0x3f3f3f3f
#define MAX 50
#define MOD 1000000007
#define E 2.71828182845
#define M 8
#define N 6
typedef long long LL;
const double PI = acos(-1.0);
/*******************************************************************************************************************************************************/
int k1 = 0;int  k2 = 0;
static int P10MAX = 10;
static int P8MAX = 10;
static int P4MAX = 4;
static int IPMAX = 8;
static int IPIMAX = 8;
static int EPMAX = 4;
static int P10[] = {3, 5, 2, 7, 4, 10, 1, 9, 8, 6, '\0'};
static int P8[] = {6, 3, 7, 4, 8, 5, 10, 9, '\0'};
static int P4[] = {2, 4, 3, 1, '\0'};
static int IP[] = {2, 6, 3, 1, 4, 8, 5, 7, '\0'};
static int IPI[] = {4, 1, 3, 5, 7, 2, 8, 6, '\0'};
static int EP[] = {4, 1, 2, 3, 2, 3, 4, 1, '\0'};
static int S0[4][4] = {
    {1, 0, 3, 2},
    {3, 2, 1, 0},
    {0, 2, 1, 3},
    {3, 1, 3, 2},
};
static int S1[4][4] = {
    {0, 1, 2, 3},
    {2, 0, 1, 3},
    {3, 0, 1, 0},
    {2, 1, 0, 3},
};
//将二进制变成数字 
int BinaryToDecimal(string binary){
    int result = 0;
    FFI(0, binary.length())result = 2 * result + (binary[i] - '0');
    return result;
}
//数组的长度 
int Getlength(int p[]){
    int i = 0;
    for(; p[i] != '\0'; i++);
    return i;
}
//置换函数 
int Permute(int inum, int p[], int pmax){
    int result = 0, length = Getlength(p);
    FFI(0, length){
        result <<= 1;
        result |= (inum >> (pmax - p[i])) & 1;
    }
    return result;
}
void SDES(int k){
    int t1 ,t2;
    t1 = t2 = 0;
    k = Permute(k, P10, P10MAX);
    //保留最低5位
    t1 = (k >> 5) & 0x1f; 
    t2 = k & 0x1f;
    t1 = ((t1 & 0xf) << 1) | ((t1 & 0x10) >> 4);
    t2 = ((t2 & 0xf) << 1) | ((t2 & 0x10) >> 4);
    k1 = Permute((t1 << 5) | t2, P8, P8MAX);
    
    t1 = ((t1 & 0x07) << 2) | ((t1 & 0x18) >> 3);
    t2 = ((t2 & 0x07) << 2) | ((t2 & 0x18) >> 3);
    k2 = Permute((t1 << 5) | t2, P8, P8MAX);
}
//fk里面的F函数
int F(int R, int K){
    int t = Permute(R, EP, EPMAX) ^ K;
    int t0 = (t >> 4) & 0xf;
    int t1 = t & 0xf;
    t0 = S0[((t0 & 0x8) >> 2) | (t0 & 1)][(t0 >> 1 & 0x3)];
    t1 = S1[((t1 & 0x8) >> 2) | (t1 & 1)][(t1 >> 1 & 0x3)];
    t = Permute((t0 << 2) | t1, P4, P4MAX);
    return t;
}
 
//最低4位 
int fk(int m, int k){
    int l = (m >> 4) & 0xf;
    int r = m & 0xf;
    return ((l ^ F(r, k)) << 4) | r;
}
int SW(int x){
    return ((x & 0xf) << 4) | ((x >> 4) & 0xf);
}
//加密 
int encrypt(int m){
    m = Permute(m, IP, IPMAX);
    m = fk(m, k1);
    m = SW(m);
    m = fk(m, k2);
    m = Permute(m, IPI, IPIMAX);
    return m;
}
//解密 
int decrypt(int m){
    m = Permute(m, IP, IPMAX);
    m = fk(m, k2);
    m = SW(m);
    m = fk(m, k1);
    m = Permute(m, IPI, IPIMAX);
    return m;
}

void printBin(int x, int n){
    int mask = 1 << (n - 1);
    while(mask > 0){
        ((x & mask) == 0) ? printf("0") : printf("1");
        mask >>= 1;
    }
    cout<<endl;
}
int main(void){
    ios::sync_with_stdio(false); cin.tie(0); cout.tie(0);
    int index, ciphertext2;string plaintext, ciphertext1, key;
    printf("****************************************************************\n");
    cout<<"***************    输入均为二进制    ***************"<<endl;
    cout<<"***************请输入明文和密文进行破解***************"<<endl;
        cout<<"***************请输入明文:***************"<<endl;
        cin>>plaintext;
        cout<<"***************请输入密文:***************"<<endl;
        cin>>ciphertext1;
        cout<<"可用密钥："<<endl;
        auto start = std::chrono::high_resolution_clock::now(); // 记录开始时间
        for(int i=0;i<=1023;i++)
        {
            SDES(i);
            ciphertext2=encrypt(BinaryToDecimal(ciphertext1));
            if(BinaryToDecimal(ciphertext1)==ciphertext2&&i>0)
            {
            	char str[] = "0000000000";
                for (int l = 0; l < 10; l++) if (((1 << l) & i) == (1 << l)) str[9 - l] = '1';
                printf("%s", str);
                cout<<endl;
			}
        }
       cout<<"结束"; 
      auto end = std::chrono::high_resolution_clock::now(); // 记录结束时间
      std::chrono::duration<double, std::milli> duration = end - start; // 计算执行时间
      std::cout << "破解时间：" << duration.count() << " 毫秒" << std::endl;
      
    return EXIT_SUCCESS;
}
