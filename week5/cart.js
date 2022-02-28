//=====================
//***執行登入api串接
//=====================
const url = "https://vue3-course-api.hexschool.io/v2";
const path = "attic-bread";
//=====================
//***標單套件
//=====================
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

//=====================
const app = Vue.createApp({
  data() {
    return {
      products: [],
      cart: {},
      cartData: {},
      productId: "",
      isLoadingItem: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },

  methods: {
    getProducts() {
      //1.API獲取資料
      const apiUrl = `${url}/api/${path}/products/all`;
      axios
        .get(apiUrl)
        .then((res) => {
          //   console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log("err");
        });
    },
    openProductmodal(id) {
      //獲取傳入的id
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      //1.API獲取資料
      const apiUrl = `${url}/api/${path}/cart`;
      axios
        .get(apiUrl)
        .then((res) => {
          console.log(res.data.data);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.log("err");
        });
    },
    addToCart(id, qty = 1) {
      const apiUrl = `${url}/api/${path}/cart`;
      const addId = {
        data: {
          product_id: id,
          qty,
        },
      };
      //預防按鈕連點 套用disable的樣式
      this.isLoadingItem = id;
      axios.post(apiUrl, addId).then((res) => {
        // console.log(res);
        this.getCart();
        this.isLoadingItem = "";
        this.$refs.productModal.closeModal();
      });
    },
    removeCartItem(id) {
      console.log(id);
      const apiUrl = `${url}/api/${path}/cart/${id}`;
      isLoadingItem = id;
      axios
        .delete(apiUrl)
        .then((res) => {
          console.log(res);
          this.getCart();
          isLoadingItem = "";
        })
        .catch((err) => {
          console.log("err");
        });
    },
    removeCartAll() {
      const apiUrl = `${url}/api/${path}/carts`;
      axios
        .delete(apiUrl)
        .then((res) => {
          console.log(res);
          this.getCart();
        })
        .catch((err) => {
          console.log("err");
        });
    },
    updateCartItem(item) {
      const apiUrl = `${url}/api/${path}/cart/${item.id}`;
      const updataId = {
        data: {
          product_id: item.id,
          qty: item.qty,
        },
      };
      this.isLoadingItem = item.id;
      axios
        .put(apiUrl, updataId)
        .then((res) => {
          console.log(res);
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((err) => {
          console.log("err");
        });
    },
    submitOrder() {
      const apiUrl = `${url}/api/${path}/order`;
      const order = this.form;
      axios
        .post(apiUrl, { data: this.form })
        .then((res) => {
          console.log(res);

          alert(res.data.message);
          this.$refs.form.resetForm();
          this.removeCartAll();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});
//商品簡介視窗
app.component("product-modal", {
  template: "#userProductModal",
  props: ["id"],
  data() {
    return {
      modal: {},
      product: {},
      cart: {},
      qty: 1,
    };
  },
  //當id資料狀態變時觸發 獲取選取的單筆資料ID
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      //1.API獲取資料
      const apiUrl = `${url}/api/${path}/product/${this.id}`;
      axios
        .get(apiUrl)
        .then((res) => {
          //   console.log(res);
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log("err");
        });
    },
    addToCart() {
      this.$emit("add-cart", this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
