const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, check, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db"); //connect database gaperlu const
const Contact = require("./model/contact"); // ambil contact

const app = express();
const port = 3000;

//setupEjs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public")); //build in middleware
app.use(express.urlencoded({ extended: true }));

//konfirgurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

//ini adalah halaman home

const mahasiswa = [
  {
    nama: "NurizkiANsyah",
    email: "Nurizki@gmail.com",
  },
  {
    nama: "Putri",
    email: "Putri@gmail.com",
  },
  {
    nama: "Ananda",
    email: "Ananda@gmail.com",
  },
];

app.get("/", (req, res) => {
  res.render("index", {
    nama: "Nurizki",
    mahasiswa: mahasiswa,
    layout: "layouts/main-layout",
    title: "Home",
  });
});

//halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "about",
  });
});

//halaman contact
app.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.render("contact", {
      layout: "layouts/main-layout",
      title: "contact",
      contacts: contacts,
      msg: req.flash("msg"),
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data contact:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data contact.");
  }
});

//halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "tambah data contact",
    layout: "layouts/main-layout",
  });
});

//proses tambah data contact
app.post("/contact", [
  body("nama").custom(async (value) => {
    const duplikat = await Contact.findOne({ nama: value });
    if (duplikat) {
      throw new Error("Nama sudah terdaftar!");
    }
    return true;
  }),
  check("email", "Email tidak valid!").isEmail(),
  check("noHp", "No HP tidak valid!").isMobilePhone("id-ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "form tambah data contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      try {
        const newContact = new Contact(req.body);
        await newContact.save();
        req.flash("msg", "Data berhasil ditambahkan!");
        res.redirect("/contact");
      } catch (error) {
        console.error("Terjadi kesalahan saat menyimpan data:", error);
        res.status(500).send("Terjadi kesalahan saat menyimpan data.");
      }
    }
  },
]);

//halaman detail contact
app.get("/contact/:nama", async (req, res) => {
  try {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render("detail", {
      layout: "layouts/main-layout",
      title: "Halaman Detail contact",
      contact: contact,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data contact:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data contact.");
  }
});

app.listen(port, () => {
  console.log(`Mongo contact App | http://localhost:${port}`);
});
