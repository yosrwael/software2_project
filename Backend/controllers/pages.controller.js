const Product = require("../models/product");
const {
  showDiscount,
  calculateNewPrice,
  getDiscountAmount,
} = require("../helpers/discount");
const { convertToUppercase } = require("../helpers/convert");

// صفحة المنزل
const homePage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }

  if (req.session.user.isAdmin == true) {
    return res.redirect("/discount");
  }

  // استرجاع المنتجات من قاعدة البيانات
  const products = await Product.find({});
  res.render("../views/home.ejs", {
    user: req.session.user,
    products: products,
    showDiscount,
    calculateNewPrice,
    getDiscountAmount,
    convertToUppercase,
  });
};

// صفحة التسجيل أو الدخول
const authPage = (req, res) => {
  res.render("../views/auth.ejs");
};

// صفحة الخصومات (للإداريين فقط)
const discountPage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }

  if (!req.session.user.isAdmin) {
    return res.redirect("/home"); // إذا كان المستخدم ليس مديرًا، إعادة توجيهه إلى الصفحة الرئيسية
  }

  // استرجاع المنتجات من قاعدة البيانات
  const products = await Product.find({});
  res.render("../views/discount.ejs", {
    user: req.session.user,
    products: products,
    showDiscount,
    calculateNewPrice,
    getDiscountAmount,
    convertToUppercase,
  });
};

module.exports = {
  homePage,
  authPage,
  discountPage,
};
