//=====================
//***執行登入api串接
//=====================

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "attic-bread";
//獲取token
const hexToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);
//設定header(axios)
axios.defaults.headers.common["Authorization"] = hexToken;
const app = Vue.createApp({
  data() {
    return {
      username: "",
      password: "",
      temp: {},
      products: [],
    };
  },
  methods: {
    getUser() {
      // 1.定義api的網址 使用者及密碼
      const user = {
        username: this.username,
        password: this.password,
      };
      //2.串接API 進行驗正
      const apiUrl = `${url}/admin/signin`;
      axios
        .post(apiUrl, user)
        .then((res) => {
          //3.取得token 及時間
          const { token, expired } = res.data;
          //4.將 token 及時間 傳入Cookie
          document.cookie = `hexToken=${token}; expire=${new Date(expired)}`;
          this.checkUser();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    checkUser() {
      //1.API獲取資料
      const apiUrl = `${url}/api/user/check`;
      axios
        .post(apiUrl)
        .then((res) => {
          console.log(res);
          //2.驗證成功 轉跳頁面
          window.location = "week_2.html";
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    showlist() {
      //1.API獲取資料
      const apiUrl = `${url}/api/${path}/admin/products`;
      axios
        .get(apiUrl)
        .then((res) => {
          console.log(res.data.products);
          //2.將資料載入
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    looklist(item) {
      temp = item;
    },
  },
  mounted() {
    this.showlist();
  },
});
app.mount("#app");
