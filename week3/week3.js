//=====================
//***執行登入api串接
//=====================

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "attic-bread";
let productModal;
let delProductModal;
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
      addTemp: {
        imagesUrl: [],
      },
      deleItemId: "",
      changeItemId: "",
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
          window.location = "week_3.html";
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
          // console.log(res.data.products);
          //2.將資料載入
          this.products = res.data.products;
        })
        .catch((err) => {
          // alert(`${err.data.message}`);
        });
    },
    looklist(item) {
      temp = item;
    },
    //判斷新增或修改
    checkItem() {
      if (!this.temp.id) {
        this.addItem();
      } else {
        this.changeItemId = this.temp.id;
        this.changeItem();
      }
    },
    //確認新增項目
    addItem() {
      // this.temp = this.addTemp;
      let newData = { data: this.addTemp };
      const apiUrl = `${url}/api/${path}/admin/product`;
      axios
        .post(apiUrl, newData)
        .then((res) => {
          this.showlist();

          productModal.hide();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    //刪除選取項目
    deleteItem() {
      const apiUrl = `${url}/api/${path}/admin/product/${this.deleItemId}`;
      axios
        .delete(apiUrl)
        .then((res) => {
          this.showlist();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    //修改選取的項目
    changeItem() {
      console.log(this.changeItemId);
      let newData = { data: this.addTemp };
      const apiUrl = `${url}/api/${path}/admin/product/${this.changeItemId}`;
      axios
        .put(apiUrl, newData)
        .then((res) => {
          this.showlist();
          productModal.hide();
        })
        .catch((err) => {
          alert(`${err.data.message}`);
        });
    },
    changeModal(item) {
      productModal.show();
      this.temp = { ...item };
      this.addTemp = this.temp;
    },
    showModal() {
      this.addTemp = {};
      productModal.show();
    },
    delProductModal(item) {
      delProductModal.show();
      this.deleItemId = item.id;
    },
  },
  mounted() {
    this.showlist();
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
});
app.mount("#app");
